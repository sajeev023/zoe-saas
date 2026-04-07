import { z } from "zod";
import { eq } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getBusinessesByUserId,
  getBusinessById,
  getCampaignsByBusinessId,
  getCampaignById,
  getGrowthProfileByBusinessId,
  getZoeActionsByBusinessId,
  getDb,
} from "../db";
import {
  generateGrowthProfile,
  generateAdCopy,
  generateWhatsAppReport,
  generateInstagramContent,
  analyzeAndOptimizeCampaign,
} from "../modules/aiService";
import { businesses, campaigns, adCreatives, growthProfiles, zoeActions } from "../../drizzle/schema";

export const campaignsRouter = router({
  /**
   * Get all businesses for the authenticated user
   */
  getBusinesses: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user?.id) throw new Error("Unauthorized");
    return await getBusinessesByUserId(ctx.user.id);
  }),

  /**
   * Get a specific business
   */
  getBusiness: protectedProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const business = await getBusinessById(input.businessId);
      if (!business || business.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }
      return business;
    }),

  /**
   * Create a new business
   */
  createBusiness: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string().optional(),
        city: z.string().optional(),
        website: z.string().optional(),
        whatsappNumber: z.string().optional(),
        mainOffer: z.string().optional(),
        targetCustomer: z.string().optional(),
        brandTone: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(businesses).values({
        userId: ctx.user.id,
        name: input.name,
        type: input.type,
        city: input.city,
        website: input.website,
        whatsappNumber: input.whatsappNumber,
        mainOffer: input.mainOffer,
        targetCustomer: input.targetCustomer,
        brandTone: input.brandTone,
      });

      return result;
    }),

  /**
   * Get all campaigns for a business
   */
  getCampaigns: protectedProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const business = await getBusinessById(input.businessId);
      if (!business || business.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }
      return await getCampaignsByBusinessId(input.businessId);
    }),

  /**
   * Create a new campaign
   */
  createCampaign: protectedProcedure
    .input(
      z.object({
        businessId: z.number(),
        name: z.string(),
        goal: z.string().optional(),
        platform: z.string().default("meta"),
        budget: z.number().default(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const business = await getBusinessById(input.businessId);
      if (!business || business.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(campaigns).values({
        businessId: input.businessId,
        name: input.name,
        goal: input.goal,
        platform: input.platform,
        budget: input.budget.toString(),
        status: "testing",
      });

      return result;
    }),

  /**
   * Update campaign status
   */
  updateCampaignStatus: protectedProcedure
    .input(
      z.object({
        campaignId: z.number(),
        status: z.enum(["active", "testing", "paused", "completed"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const campaign = await getCampaignById(input.campaignId);
      if (!campaign) throw new Error("Campaign not found");

      const business = await getBusinessById(campaign.businessId);
      if (!business || business.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(campaigns)
        .set({ status: input.status })
        .where(eq(campaigns.id, input.campaignId));

      return { success: true };
    }),

  /**
   * Generate growth profile via Onboarding Agent
   */
  generateGrowthProfile: publicProcedure
    .input(
      z.object({
        businessId: z.number(),
        name: z.string(),
        type: z.string(),
        city: z.string(),
        mainOffer: z.string(),
        targetCustomer: z.string(),
        brandTone: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const business = await getBusinessById(input.businessId);
      if (!business || business.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      const profile = await generateGrowthProfile({
        name: input.name,
        type: input.type,
        city: input.city,
        mainOffer: input.mainOffer,
        targetCustomer: input.targetCustomer,
        brandTone: input.brandTone,
      });

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(growthProfiles).values({
        businessId: input.businessId,
        idealCustomer: profile.idealCustomer,
        winningHooks: profile.winningHooks,
        bestCreativeFormat: profile.bestCreativeFormat,
        recommendedTargeting: profile.recommendedTargeting,
        competitorWeakness: profile.competitorWeakness,
      });

      return profile;
    }),

  /**
   * Generate ad copy via Creative Agent
   */
  generateAdCopy: publicProcedure
    .input(
      z.object({
        businessId: z.number(),
        businessName: z.string(),
        goal: z.string(),
        format: z.string(),
        city: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const business = await getBusinessById(input.businessId);
      if (!business || business.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      return await generateAdCopy({
        businessName: input.businessName,
        goal: input.goal,
        format: input.format,
        city: input.city,
      });
    }),

  /**
   * Generate WhatsApp report via Reporting Agent
   */
  generateWhatsAppReport: publicProcedure
    .input(
      z.object({
        businessId: z.number(),
        leads: z.number(),
        bestAd: z.string(),
        cpl: z.number(),
        spend: z.number(),
        roas: z.number(),
        actions: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const business = await getBusinessById(input.businessId);
      if (!business || business.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      return await generateWhatsAppReport({
        leads: input.leads,
        bestAd: input.bestAd,
        cpl: input.cpl,
        spend: input.spend,
        roas: input.roas,
        actions: input.actions,
      });
    }),

  /**
   * Generate Instagram content via Content Agent
   */
  generateInstagramContent: protectedProcedure
    .input(
      z.object({
        businessId: z.number(),
        businessName: z.string(),
        theme: z.string(),
        tone: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const business = await getBusinessById(input.businessId);
      if (!business || business.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      return await generateInstagramContent({
        businessName: input.businessName,
        theme: input.theme,
        tone: input.tone,
      });
    }),

  /**
   * Get activity feed for a business
   */
  getActivityFeed: protectedProcedure
    .input(z.object({ businessId: z.number(), limit: z.number().default(10) }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const business = await getBusinessById(input.businessId);
      if (!business || business.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }
      return await getZoeActionsByBusinessId(input.businessId, input.limit);
    }),

  /**
   * Get growth profile for a business
   */
  getGrowthProfile: protectedProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user?.id) throw new Error("Unauthorized");
      const business = await getBusinessById(input.businessId);
      if (!business || business.userId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }
      return await getGrowthProfileByBusinessId(input.businessId);
    }),
});
