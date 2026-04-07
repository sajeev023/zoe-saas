import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, businesses, campaigns, adCreatives, growthProfiles, weeklyReports, zoeActions } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.supabaseId) {
    throw new Error("User supabaseId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      supabaseId: user.supabaseId,
      email: user.email,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "avatar"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }
    if (user.plan !== undefined) {
      values.plan = user.plan;
      updateSet.plan = user.plan;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserBySupabaseId(supabaseId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.supabaseId, supabaseId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getBusinessesByUserId(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get businesses: database not available");
    return [];
  }

  return await db.select().from(businesses).where(eq(businesses.userId, userId));
}

export async function getBusinessById(businessId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get business: database not available");
    return undefined;
  }

  const result = await db.select().from(businesses).where(eq(businesses.id, businessId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCampaignsByBusinessId(businessId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get campaigns: database not available");
    return [];
  }

  return await db.select().from(campaigns).where(eq(campaigns.businessId, businessId));
}

export async function getCampaignById(campaignId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get campaign: database not available");
    return undefined;
  }

  const result = await db.select().from(campaigns).where(eq(campaigns.id, campaignId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getGrowthProfileByBusinessId(businessId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get growth profile: database not available");
    return undefined;
  }

  const result = await db.select().from(growthProfiles).where(eq(growthProfiles.businessId, businessId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getZoeActionsByBusinessId(businessId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get zoe actions: database not available");
    return [];
  }

  return await db.select().from(zoeActions).where(eq(zoeActions.businessId, businessId)).orderBy((t) => t.createdAt).limit(limit);
}

export async function getWeeklyReportByBusinessId(businessId: number, week: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get weekly report: database not available");
    return undefined;
  }

  const result = await db.select().from(weeklyReports).where(
    eq(weeklyReports.businessId, businessId) && eq(weeklyReports.week, week)
  ).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
