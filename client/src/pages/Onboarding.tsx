import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  businessName: string;
  businessType: string;
  city: string;
  mainOffer: string;
  targetCustomer: string;
  brandTone: string;
}

interface GrowthProfile {
  idealCustomer: string;
  winningHooks: string;
  bestCreativeFormat: string;
  recommendedTargeting: string;
  competitorWeakness: string;
}

const businessTypes = [
  "E-commerce",
  "SaaS",
  "Service Business",
  "Fitness",
  "Beauty",
  "Food & Beverage",
  "Real Estate",
  "Education",
  "Healthcare",
  "Other",
];

const brandTones = [
  "Professional",
  "Casual",
  "Friendly",
  "Bold",
  "Luxury",
  "Playful",
];

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [growthProfile, setGrowthProfile] = useState<GrowthProfile | null>(null);
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessType: "",
    city: "",
    mainOffer: "",
    targetCustomer: "",
    brandTone: "",
  });

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("onboardingData");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  // Save form data to localStorage
  const saveFormData = () => {
    localStorage.setItem("onboardingData", JSON.stringify(formData));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    saveFormData();

    if (step === 3) {
      // Generate growth profile
      setLoading(true);
      try {
        // Simulate AI generation with a fetch call
        const response = await fetch("/api/campaigns/generateGrowthProfile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          setGrowthProfile(data);
          localStorage.setItem("growthProfile", JSON.stringify(data));
          localStorage.setItem("businessName", formData.businessName);
        }
      } catch (error) {
        console.error("Failed to generate growth profile:", error);
      } finally {
        setLoading(false);
      }
    }

    setStep((prev) => (prev < 4 ? ((prev + 1) as Step) : prev));
  };

  const handlePrev = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  };

  const handleComplete = () => {
    localStorage.setItem("businessName", formData.businessName);
    localStorage.setItem("onboardingComplete", "true");
    navigate("/dashboard");
  };

  const isStep1Valid =
    formData.businessName.trim() && formData.businessType.trim();
  const isStep2Valid =
    formData.city.trim() && formData.mainOffer.trim() && formData.targetCustomer.trim();
  const isStep3Valid = formData.brandTone.trim();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex gap-2 p-6 border-b border-border">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-accent" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="p-8">
          {/* Step 1: Business Basics */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Tell us about your business</h2>
                <p className="text-muted-foreground">Step 1 of 4</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    placeholder="e.g., FitZone Gym"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleInputChange("businessName", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) =>
                      handleInputChange("businessType", value)
                    }
                  >
                    <SelectTrigger id="businessType">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Market Info */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your market</h2>
                <p className="text-muted-foreground">Step 2 of 4</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="city">City / Location</Label>
                  <Input
                    id="city"
                    placeholder="e.g., New York"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="mainOffer">Main Offer</Label>
                  <Input
                    id="mainOffer"
                    placeholder="e.g., Premium gym membership"
                    value={formData.mainOffer}
                    onChange={(e) =>
                      handleInputChange("mainOffer", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="targetCustomer">Target Customer</Label>
                  <Input
                    id="targetCustomer"
                    placeholder="e.g., Fitness enthusiasts aged 25-45"
                    value={formData.targetCustomer}
                    onChange={(e) =>
                      handleInputChange("targetCustomer", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Brand Voice */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your brand voice</h2>
                <p className="text-muted-foreground">Step 3 of 4</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="brandTone">Brand Tone</Label>
                  <Select
                    value={formData.brandTone}
                    onValueChange={(value) =>
                      handleInputChange("brandTone", value)
                    }
                  >
                    <SelectTrigger id="brandTone">
                      <SelectValue placeholder="Select a tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandTones.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    We'll use this information to generate your personalized growth profile and create AI-powered marketing strategies tailored to your business.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Growth Profile */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Growth Profile</h2>
                <p className="text-muted-foreground">Step 4 of 4</p>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  <p className="text-muted-foreground">
                    ZOE is generating your growth profile...
                  </p>
                </div>
              ) : growthProfile ? (
                <div className="space-y-4">
                  {[
                    {
                      label: "Ideal Customer",
                      value: growthProfile.idealCustomer,
                      delay: 0,
                    },
                    {
                      label: "Winning Hooks",
                      value: growthProfile.winningHooks,
                      delay: 300,
                    },
                    {
                      label: "Best Creative Format",
                      value: growthProfile.bestCreativeFormat,
                      delay: 600,
                    },
                    {
                      label: "Recommended Targeting",
                      value: growthProfile.recommendedTargeting,
                      delay: 900,
                    },
                    {
                      label: "Competitor Weakness",
                      value: growthProfile.competitorWeakness,
                      delay: 1200,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="animate-in fade-in slide-in-from-bottom-4"
                      style={{
                        animationDelay: `${item.delay}ms`,
                        animationDuration: "500ms",
                        animationFillMode: "both",
                      }}
                    >
                      <div className="flex gap-4 p-4 bg-card border border-border rounded-lg">
                        <div className="text-accent font-semibold min-w-fit">
                          {item.label}
                        </div>
                        <div className="text-foreground">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Click "Next" to generate your growth profile
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={step === 1 || loading}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={
                  loading ||
                  (step === 1 && !isStep1Valid) ||
                  (step === 2 && !isStep2Valid) ||
                  (step === 3 && !isStep3Valid)
                }
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
