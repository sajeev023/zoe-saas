import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Plus, Loader2, MessageCircle, LogOut, Settings, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface Campaign {
  id: string;
  name: string;
  status: "Testing" | "Active" | "Paused";
  leads: number;
  cpl: number;
  spend: number;
  roas: number;
}

interface AdCopy {
  headline: string;
  primaryText: string;
  cta: string;
  hook: string;
  targetAudience: string;
}

interface ActivityItem {
  icon: string;
  text: string;
  time: string;
  pulse: boolean;
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [businessName, setBusinessName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Fix 5: track mobile viewport ──
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: "1", name: "Summer Promo", status: "Active", leads: 234, cpl: 12, spend: 2800, roas: 4.2 },
    { id: "2", name: "New Member Drive", status: "Testing", leads: 45, cpl: 18, spend: 810, roas: 2.8 },
  ]);

  const [whatsappReport, setWhatsappReport] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isGeneratingAdCopy, setIsGeneratingAdCopy] = useState(false);
  const [generatedAdCopy, setGeneratedAdCopy] = useState<AdCopy | null>(null);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  // ── Fix 4: Count-up animation state ──
  const [animated, setAnimated] = useState({ leads: 0, cpl: 0, spent: 0 });

  // ── Fix 3: ZOE Activity Feed state ──
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([
    { icon: "🟢", text: "Campaign 'Summer Promo' is performing above average", time: "2m ago", pulse: false },
    { icon: "🟡", text: "Budget pacing on track for the week", time: "18m ago", pulse: false },
    { icon: "🔵", text: "Audience overlap detected — adjusting targeting", time: "34m ago", pulse: false },
    { icon: "🟢", text: "New creative variant queued for testing", time: "1h ago", pulse: false },
    { icon: "🟡", text: "Analysing competitor ad performance", time: "2h ago", pulse: false },
  ]);

  const randomActions = [
    "🟡 Analysing competitor ad performance",
    "🔵 Audience overlap detected — adjusting targeting",
    "🟢 New creative variant queued for testing",
    "🟡 Budget pacing on track for the week",
    "🔵 Instagram reach up 12% this week",
  ];

  // ── Fix 4: Count-up on mount ──
  useEffect(() => {
    const animate = (key: string, target: number, duration: number) => {
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        const val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
        setAnimated((prev) => ({ ...prev, [key]: val }));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    animate("leads", 47, 1000);
    animate("cpl", 34, 1000);
    animate("spent", 8400, 1200);
  }, []);

  // ── Fix 3: Activity feed auto-update ──
  useEffect(() => {
    const interval = setInterval(() => {
      const action = randomActions[Math.floor(Math.random() * randomActions.length)];
      const icon = action.split(" ")[0];
      const text = action.substring(2);
      setActivityFeed((prev) => [
        { icon, text, time: "just now", pulse: true },
        ...prev.map((item) => ({ ...item, pulse: false })).slice(0, 7),
      ]);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const saved = localStorage.getItem("businessName");
    if (!saved) {
      navigate("/onboarding");
      return;
    }
    setBusinessName(saved);
  }, [navigate]);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const response = await fetch("/api/campaigns/generateWhatsAppReport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leads: campaigns.reduce((sum, c) => sum + c.leads, 0),
          bestAd: "Summer Promo",
          cpl: 15,
          spend: campaigns.reduce((sum, c) => sum + c.spend, 0),
          roas: 3.8,
          actions: 12,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setWhatsappReport(data.report || data);
        toast.success("Report generated!");
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleGenerateAdCopy = async () => {
    setIsGeneratingAdCopy(true);
    try {
      const response = await fetch("/api/campaigns/generateAdCopy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          goal: "Increase membership signups",
          format: "Meta Ad",
          city: localStorage.getItem("city") || "Hyderabad",
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedAdCopy(data);
        toast.success("Ad copy generated!");
      }
    } catch (error) {
      console.error("Failed to generate ad copy:", error);
      toast.error("Failed to generate ad copy");
    } finally {
      setIsGeneratingAdCopy(false);
    }
  };

  const handleAddCampaign = () => {
    if (!newCampaignName.trim() || !generatedAdCopy) {
      toast.error("Please generate ad copy first");
      return;
    }
    const newCampaign: Campaign = {
      id: String(campaigns.length + 1),
      name: newCampaignName,
      status: "Testing",
      leads: 0,
      cpl: 0,
      spend: 0,
      roas: 0,
    };
    setCampaigns([...campaigns, newCampaign]);
    setNewCampaignName("");
    setGeneratedAdCopy(null);
    setShowCampaignModal(false);
    toast.success("Campaign added!");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0);
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);

  // ── Sidebar nav items ──
  const navItems = [
    { label: "Dashboard", icon: "📊" },
    { label: "Campaigns", icon: "📣" },
    { label: "Content", icon: "📅" },
    { label: "Reports", icon: "📋" },
    { label: "Settings", icon: "⚙️" },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid rgba(255,255,255,.055)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "28px",
            color: "#e8c97a",
            letterSpacing: "2px",
          }}
        >
          ZOE.
        </span>
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: "none", border: "none", color: "#9eadc8", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {navItems.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "8px",
              background: i === 0 ? "#e8c97a" : "transparent",
              color: i === 0 ? "#000" : "#9eadc8",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: i === 0 ? 600 : 400,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (i !== 0) {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(232,201,122,.08)";
                (e.currentTarget as HTMLDivElement).style.color = "#eef0f8";
              }
            }}
            onMouseLeave={(e) => {
              if (i !== 0) {
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
                (e.currentTarget as HTMLDivElement).style.color = "#9eadc8";
              }
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* User profile */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,.055)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(232,201,122,.15)",
            border: "1px solid rgba(232,201,122,.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#e8c97a",
            fontWeight: 700,
            fontSize: "16px",
            flexShrink: 0,
          }}
        >
          {businessName.charAt(0) || "Z"}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: "13px", color: "#eef0f8", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {businessName || "Demo User"}
          </div>
          <div
            style={{
              fontSize: "11px",
              background: "rgba(232,201,122,.1)",
              color: "#e8c97a",
              padding: "2px 8px",
              borderRadius: "100px",
              marginTop: "2px",
              display: "inline-block",
            }}
          >
            Growth Plan
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#05060e" }}>

      {/* ── Fix 2+5: Sidebar — hidden on mobile, fixed on desktop ── */}
      {!isMobile && (
        <aside
          style={{
            width: "240px",
            minHeight: "100vh",
            background: "#080b16",
            borderRight: "1px solid rgba(255,255,255,.055)",
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 40,
          }}
        >
          <SidebarContent />
        </aside>
      )}

      {/* ── Fix 5: Mobile sidebar overlay ── */}
      {isMobile && sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.6)",
              zIndex: 39,
            }}
          />
          <aside
            style={{
              width: "240px",
              minHeight: "100vh",
              background: "#080b16",
              borderRight: "1px solid rgba(255,255,255,.055)",
              display: "flex",
              flexDirection: "column",
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: 40,
            }}
          >
            <SidebarContent />
          </aside>
        </>
      )}

      {/* ── Main content area ── */}
      <div
        style={{
          marginLeft: isMobile ? 0 : "240px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* ── Fix 2: Top Bar ── */}
        <header
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid rgba(255,255,255,.055)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(8,11,22,0.9)",
            backdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* ── Fix 5: Hamburger on mobile ── */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{ background: "none", border: "none", color: "#9eadc8", cursor: "pointer", padding: "4px" }}
              >
                <Menu size={22} />
              </button>
            )}
            <h1
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "22px",
                color: "#eef0f8",
                letterSpacing: "1px",
              }}
            >
              {businessName || "Dashboard"}
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                color: "#34d399",
                background: "rgba(52,211,153,.1)",
                padding: "4px 12px",
                borderRadius: "100px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#34d399",
                  animation: "pulse 2s infinite",
                }}
              />
              ZOE is Live
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,.055)",
                borderRadius: "8px",
                color: "#9eadc8",
                padding: "6px 12px",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        <main style={{ padding: "24px", flex: 1 }}>

          {/* ── Fix 4: Animated Metric Cards ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {/* Card 1: Leads */}
            <div
              style={{
                background: "#141d30",
                border: "1px solid rgba(232,201,122,.22)",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <p style={{ color: "#9eadc8", fontSize: "13px", marginBottom: "8px" }}>
                Leads This Week
              </p>
              <p
                style={{
                  color: "#eef0f8",
                  fontSize: "36px",
                  fontWeight: 700,
                  lineHeight: 1,
                  marginBottom: "8px",
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: "1px",
                }}
              >
                {animated.leads}
              </p>
              <span style={{ color: "#34d399", fontSize: "13px", fontWeight: 600 }}>
                ↑34% vs last week
              </span>
            </div>

            {/* Card 2: CPL */}
            <div
              style={{
                background: "#141d30",
                border: "1px solid rgba(232,201,122,.22)",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <p style={{ color: "#9eadc8", fontSize: "13px", marginBottom: "8px" }}>
                Cost Per Lead
              </p>
              <p
                style={{
                  color: "#eef0f8",
                  fontSize: "36px",
                  fontWeight: 700,
                  lineHeight: 1,
                  marginBottom: "8px",
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: "1px",
                }}
              >
                ₹{animated.cpl}
              </p>
              <span style={{ color: "#34d399", fontSize: "13px", fontWeight: 600 }}>
                ↓61% vs agency
              </span>
            </div>

            {/* Card 3: Budget */}
            <div
              style={{
                background: "#141d30",
                border: "1px solid rgba(232,201,122,.22)",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <p style={{ color: "#9eadc8", fontSize: "13px", marginBottom: "8px" }}>
                Budget Spent
              </p>
              <p
                style={{
                  color: "#eef0f8",
                  fontSize: "36px",
                  fontWeight: 700,
                  lineHeight: 1,
                  marginBottom: "4px",
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: "1px",
                }}
              >
                ₹{animated.spent.toLocaleString()}
              </p>
              <p style={{ color: "#9eadc8", fontSize: "12px", marginBottom: "8px" }}>
                of ₹15,000
              </p>
              {/* Gold progress bar */}
              <div
                style={{
                  height: "4px",
                  background: "rgba(255,255,255,.08)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min((animated.spent / 15000) * 100, 100)}%`,
                    background: "linear-gradient(90deg, #e8c97a, #c9a84c)",
                    borderRadius: "2px",
                    transition: "width 0.1s",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── Fix 3: ZOE Activity Feed ── */}
          <div
            style={{
              background: "#141d30",
              border: "1px solid rgba(232,201,122,.22)",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#34d399",
                  animation: "pulse 2s infinite",
                }}
              />
              <h3
                style={{
                  color: "#eef0f8",
                  fontSize: "15px",
                  fontWeight: 600,
                }}
              >
                ZOE Activity — Today
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {activityFeed.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "10px",
                    background: i === 0 ? "rgba(232,201,122,.04)" : "transparent",
                    borderRadius: "8px",
                    border: i === 0 ? "1px solid rgba(232,201,122,.1)" : "1px solid transparent",
                    transition: "all 0.3s",
                  }}
                >
                  <span
                    style={{
                      fontSize: "16px",
                      flexShrink: 0,
                      animation: item.pulse ? "pulse 1s infinite" : "none",
                    }}
                  >
                    {item.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#eef0f8", fontSize: "13px", lineHeight: "1.4" }}>
                      {item.text}
                    </p>
                    <p style={{ color: "#4e6080", fontSize: "11px", marginTop: "2px" }}>
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              marginBottom: "24px",
            }}
          >
            {/* WhatsApp Report */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-accent" />
                Weekly Report
              </h3>
              <Button
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mb-4"
              >
                {isGeneratingReport ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send WhatsApp Report
                  </>
                )}
              </Button>
              {whatsappReport && (
                <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                  <p className="text-foreground whitespace-pre-wrap">{whatsappReport}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => {
                      const url = `https://wa.me/?text=${encodeURIComponent(whatsappReport)}`;
                      window.open(url, "_blank");
                    }}
                  >
                    Open in WhatsApp
                  </Button>
                </div>
              )}
            </Card>

            {/* Create Campaign */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-accent" />
                New Campaign
              </h3>
              <Dialog open={showCampaignModal} onOpenChange={setShowCampaignModal}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mb-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Create with ZOE
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Generate Ad Copy with ZOE</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <Button
                      onClick={handleGenerateAdCopy}
                      disabled={isGeneratingAdCopy}
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      {isGeneratingAdCopy ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Ad Copy"
                      )}
                    </Button>

                    {generatedAdCopy && (
                      <div className="space-y-4 bg-card border border-border p-6 rounded-lg">
                        {[
                          { label: "Headline", value: generatedAdCopy.headline },
                          { label: "Primary Text", value: generatedAdCopy.primaryText },
                          { label: "CTA", value: generatedAdCopy.cta },
                          { label: "Hook", value: generatedAdCopy.hook },
                          { label: "Target Audience", value: generatedAdCopy.targetAudience },
                        ].map((field, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="text-accent font-semibold min-w-fit">{field.label}</div>
                            <div className="text-foreground">{field.value}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {generatedAdCopy && (
                      <div>
                        <Label htmlFor="campaignName">Campaign Name</Label>
                        <Input
                          id="campaignName"
                          placeholder="e.g., Summer Promo v2"
                          value={newCampaignName}
                          onChange={(e) => setNewCampaignName(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowCampaignModal(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddCampaign}
                        disabled={!generatedAdCopy || !newCampaignName.trim()}
                        className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        Add Campaign
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          </div>

          {/* Campaigns Table */}
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold">Active Campaigns</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Campaign</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Leads</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">CPL</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Spend</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-6 py-4 font-medium">
                        {businessName} — {campaign.name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            campaign.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : campaign.status === "Testing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{campaign.leads}</td>
                      <td className="px-6 py-4">₹{campaign.cpl}</td>
                      <td className="px-6 py-4">₹{campaign.spend}</td>
                      <td className="px-6 py-4 font-semibold text-accent">{campaign.roas}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
