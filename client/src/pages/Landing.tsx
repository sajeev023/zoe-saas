import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  ChevronRight,
  ArrowRight,
  Zap,
  TrendingUp,
  BarChart3,
  MessageCircle,
  Sparkles,
  Settings,
  Rocket,
} from "lucide-react";

// ── Fix 1: Correct IntersectionObserver — uses class-based reveal, no broken refs ──
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".scroll-reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

export default function Landing() {
  const [, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // ── Fix 1: call with no return value ──
  useScrollReveal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-bg0 text-text overflow-hidden">
      {/* Announcement Bar — stays in normal flow */}
      <div
        className="bg-gradient-to-r from-gold/20 to-gold/10 border-b border-gold-border py-3 px-4 text-center"
        style={{ borderColor: "rgba(232,201,122,.22)" }}
      >
        <p className="text-sm font-medium">
          🚀 Early Access Open — First 50 businesses get 30 days completely free.{" "}
          <button
            onClick={() => navigate("/onboarding")}
            className="text-gold hover:text-gold-dim font-semibold inline-flex items-center gap-1"
          >
            Claim your spot <ArrowRight className="w-4 h-4" />
          </button>
        </p>
      </div>

      {/* ── Fix 4: Nav sits below the 44px announcement bar ── */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bg0/80 backdrop-blur border-b border-gold-border"
            : ""
        }`}
        style={{ top: "44px", borderColor: "rgba(232,201,122,.22)" }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-wider">
            <span className="text-gold">ZOE</span>
            <span className="text-gold">.</span>
          </div>

          <div className="hidden md:flex gap-8 items-center">
            {["How It Works", "Features", "Pricing", "About"].map((item) => (
              <button
                key={item}
                onClick={() =>
                  scrollToSection(item.toLowerCase().replace(" ", "-"))
                }
                className="text-text-muted hover:text-gold transition-colors text-sm font-medium"
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate("/login")}
            className="btn-primary text-sm"
          >
            Get Early Access
          </button>
        </div>
      </nav>

      {/* ── Fix 4: Hero padded to clear announcement bar + nav ── */}
      <section className="pb-20 px-4 relative overflow-hidden" style={{ paddingTop: "120px" }}>
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute top-20 right-10 w-96 h-96 rounded-full blur-3xl"
            style={{
              background: "rgba(232,201,122,0.10)",
            }}
          />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-block mb-6 px-4 py-2 rounded-full"
                style={{
                  background: "rgba(232,201,122,.06)",
                  border: "1px solid rgba(232,201,122,.22)",
                }}
              >
                <span className="text-gold text-sm font-semibold">
                  Autonomous AI Growth Agent
                </span>
              </div>

              <h1
                className="text-5xl md:text-7xl font-bold tracking-tight mb-6 blur-in"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                YOUR AI HEAD OF GROWTH.
                <br />
                <span className="text-gold">REPLACE YOUR AGENCY.</span>
              </h1>

              <p className="text-lg text-text-muted mb-8 leading-relaxed">
                ZOE learns your business overnight and runs your entire paid and
                organic growth on autopilot — forever. At ₹2,999/month instead
                of ₹30,000.
              </p>

              <div className="flex gap-4 mb-12">
                <button
                  onClick={() => navigate("/login")}
                  className="btn-primary flex items-center gap-2"
                >
                  Get Early Access <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="btn-outline flex items-center gap-2"
                >
                  See how it works <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "10x cheaper", icon: "💰" },
                  { label: "24/7 optimising", icon: "⚡" },
                  { label: "48hrs to first campaign", icon: "🚀" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <p className="text-sm text-text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:block">
              <div
                className="rounded-xl p-6 shadow-gold-glow"
                style={{
                  background: "var(--surface)",
                  border: "1px solid rgba(232,201,122,.22)",
                }}
              >
                <div className="space-y-4">
                  {[
                    { label: "Leads This Week", value: "47", change: "+34%" },
                    { label: "Cost Per Lead", value: "₹34", change: "-61%" },
                    { label: "ROAS", value: "4.2x", change: "+12%" },
                  ].map((metric, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 rounded-lg"
                      style={{ background: "var(--bg2)" }}
                    >
                      <span className="text-text-muted text-sm">
                        {metric.label}
                      </span>
                      <div className="text-right">
                        <div className="font-semibold text-gold">
                          {metric.value}
                        </div>
                        <div className="text-xs text-green">{metric.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Strip */}
      <section
        className="py-12 overflow-hidden"
        style={{ borderTop: "1px solid rgba(232,201,122,.22)", borderBottom: "1px solid rgba(232,201,122,.22)" }}
      >
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[
            "FitZone Gym",
            "DermaCare Clinic",
            "IIT Masters Coaching",
            "Urban Threads",
            "SmileFirst Dental",
            "Alpha Athletics",
            "FitZone Gym",
            "DermaCare Clinic",
            "IIT Masters Coaching",
            "Urban Threads",
          ].map((name, i) => (
            <div key={i} className="text-text-muted font-medium">
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* ── Problem Section — Fix 2: scroll-reveal on every card ── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            The Problem with Current Solutions
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Agencies",
                price: "₹15k-80k/month",
                problems: [
                  "Slow response",
                  "Generic strategies",
                  "No accountability",
                ],
              },
              {
                title: "DIY Marketing",
                price: "Your time",
                problems: [
                  "Constant burnout",
                  "Inconsistent results",
                  "Learning curve",
                ],
              },
              {
                title: "AI Tools",
                price: "Fragmented",
                problems: [
                  "No integration",
                  "Manual work",
                  "No optimization",
                ],
              },
            ].map((item, i) => (
              // ── Fix 1+2: replaced broken ref+revealed pattern with scroll-reveal class ──
              <div
                key={i}
                className="scroll-reveal card-premium"
                style={{ borderTop: "4px solid var(--red)" }}
              >
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gold text-sm font-semibold mb-4">
                  {item.price}
                </p>
                <ul className="space-y-2">
                  {item.problems.map((problem, j) => (
                    <li
                      key={j}
                      className="text-text-muted text-sm flex items-center gap-2"
                    >
                      <span className="text-red">×</span> {problem}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works — Fix 2: scroll-reveal on every step ── */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="space-y-8">
            {[
              {
                num: "1",
                title: "Connect Your Accounts",
                desc: "Link Meta Ads, Google Ads, and analytics in 2 minutes",
              },
              {
                num: "2",
                title: "ZOE Learns Your Business",
                desc: "AI analyzes your market, competitors, and past campaigns",
              },
              {
                num: "3",
                title: "First Campaign in 48hrs",
                desc: "Fully optimized ad copy, targeting, and budget allocation",
              },
              {
                num: "4",
                title: "24/7 Optimization",
                desc: "Real-time performance analysis and automatic adjustments",
              },
              {
                num: "5",
                title: "Scale Effortlessly",
                desc: "Watch your ROAS grow while you focus on operations",
              },
            ].map((step, i) => (
              <div key={i} className="scroll-reveal flex gap-6">
                <div className="flex-shrink-0">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-full font-bold"
                    style={{ background: "var(--gold)", color: "var(--bg0)" }}
                  >
                    {step.num}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features — Fix 2: scroll-reveal on every card ── */}
      <section
        id="features"
        className="py-20 px-4"
        style={{ background: "var(--bg1)" }}
      >
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: "AI Ad Copy",
                desc: "Generates winning ad variations automatically",
              },
              {
                icon: TrendingUp,
                title: "Real-time Optimization",
                desc: "Adjusts budgets and targeting 24/7",
              },
              {
                icon: BarChart3,
                title: "Performance Analytics",
                desc: "Deep insights into every campaign metric",
              },
              {
                icon: MessageCircle,
                title: "WhatsApp Reports",
                desc: "Weekly summaries delivered to your phone",
              },
              {
                icon: Zap,
                title: "Instant Scaling",
                desc: "Double your leads without doubling spend",
              },
              {
                icon: Settings,
                title: "Full Automation",
                desc: "Set it and forget it — ZOE handles everything",
              },
            ].map((feature, i) => (
              <div key={i} className="scroll-reveal card-premium">
                <feature.icon className="w-8 h-8 text-gold mb-4" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-text-muted text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing — Fix 2: scroll-reveal on every plan card ── */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">
            Simple Pricing
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Starter",
                price: "₹2,999",
                features: ["1 Business", "Basic Analytics", "Email Support"],
              },
              {
                name: "Growth",
                price: "₹5,999",
                features: [
                  "3 Businesses",
                  "Advanced Analytics",
                  "Priority Support",
                  "WhatsApp Reports",
                ],
                featured: true,
              },
              {
                name: "Scale",
                price: "₹12,999",
                features: [
                  "Unlimited Businesses",
                  "Full Analytics",
                  "24/7 Support",
                  "Custom Integrations",
                ],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`scroll-reveal card-premium transition-all duration-300 ${
                  plan.featured ? "shadow-gold-glow-lg scale-105" : ""
                }`}
                style={
                  plan.featured
                    ? { border: "2px solid var(--gold)" }
                    : undefined
                }
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-gold mb-6">
                  {plan.price}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li
                      key={j}
                      className="text-text-muted text-sm flex items-center gap-2"
                    >
                      <span className="text-gold">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/onboarding")}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.featured ? "btn-primary" : ""
                  }`}
                  style={
                    !plan.featured
                      ? {
                          border: "1px solid var(--gold)",
                          color: "var(--gold)",
                          background: "transparent",
                        }
                      : undefined
                  }
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="py-20 px-4"
        style={{ background: "var(--bg1)" }}
      >
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-6">Built by Ajay, 16</h2>
          <p className="text-text-muted mb-8 text-lg">
            From Hyderabad. 2 years of Meta Ads experience. Built ZOE to solve
            the problem of expensive agencies and fragmented AI tools.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="https://instagram.com/sajeev_ajay.023"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-dim font-semibold"
            >
              Instagram
            </a>
            <span className="text-text-sub">•</span>
            <a
              href="https://youtube.com/@sajeevajay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-dim font-semibold"
            >
              YouTube
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2
            className="text-5xl font-bold tracking-tight mb-8"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            STOP MANAGING MARKETING.
            <br />
            <span className="text-gold">LET ZOE RUN IT.</span>
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
          >
            Get Early Access Now <Rocket className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12 px-4"
        style={{
          borderTop: "1px solid rgba(232,201,122,.22)",
          background: "var(--bg1)",
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-gold">ZOE</span>
                <span className="text-gold">.</span>
              </div>
              <p className="text-text-muted text-sm">Your AI Head of Growth</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Security"] },
              { title: "Company", links: ["About", "Blog", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-bold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="text-text-muted hover:text-gold text-sm transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className="pt-8 text-center text-text-muted text-sm"
            style={{ borderTop: "1px solid rgba(232,201,122,.22)" }}
          >
            <p>© 2026 ZOE. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
