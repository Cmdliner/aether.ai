"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { getTestRecommendations } from "@/lib/test-recommendations";
import { useAuth } from "@/lib/client-auth";
import { 
  TestRecommendationRequest, 
  TestRecommendationResponse, 
  RecommendedTest 
} from "@/lib/types/test-recommendation";
import { 
  MessageSquare, 
  Stethoscope, 
  User, 
  Map, 
  Flag, 
  Calendar, 
  Send, 
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Info,
  Clipboard,
  ChevronRight
} from "lucide-react";

export default function TestRecommendationForm() {
  const { user, isLoading: authLoading } = useAuth();
  
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<TestRecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userAge, setUserAge] = useState<number | null>(null);
  const [animateResults, setAnimateResults] = useState(false);
  
  // Calculate age from date of birth
  useEffect(() => {
    if (user?.dob) {
      const dob = new Date(user.dob);
      const today = new Date();
      
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      // Adjust age if birthday hasn't occurred yet this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      setUserAge(age);
    }
  }, [user?.dob]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!symptoms.trim()) {
        throw new Error("Please describe your symptoms");
      }

      // Create request data using user profile information
      const requestData: TestRecommendationRequest = {
        symptoms,
        // Use calculated age from DOB
        age: userAge || undefined,
        // Map gender 'M'/'F' to 'male'/'female' for the AI
        gender: user?.gender === 'M' ? 'male' : user?.gender === 'F' ? 'female' : "",
        race: user?.nationality || "",
        location: user?.current_residence || "",
      };      const response = await getTestRecommendations(requestData);
      
      // Check if this is a fallback response
      if (response.fallback) {
        console.warn("Using fallback recommendations due to AI service issue");
      }
        setRecommendations(response);
      // Set animation flag for results
      setAnimateResults(true);
    } catch (err: any) {
      setError(err.message || "Failed to get test recommendations");
    } finally {
      setLoading(false);
    }
  };  return (    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Medical Test Recommendations</h1>
        <p className="text-muted-foreground">
          Describe your symptoms to receive AI-powered test recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span>Describe Your Symptoms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symptoms" className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    <span>What symptoms are you experiencing?</span>
                  </Label>
                  <div className="relative">
                    <textarea
                      id="symptoms"
                      className="w-full min-h-[160px] p-3 rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Please describe your symptoms in detail. For example: I've been experiencing headaches for the past three days, along with a mild fever and fatigue."
                      required
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {symptoms.length > 0 ? `${symptoms.length} characters` : ""}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Analyzing Symptoms...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Get Test Recommendations</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {error && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-md flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>        <div className="lg:col-span-1">
          <Card className="bg-muted">
            <CardHeader className="border-b">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Your Health Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {authLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-muted-foreground/20 rounded-md"></div>
                  <div className="h-6 bg-muted-foreground/20 rounded-md w-5/6"></div>
                  <div className="h-6 bg-muted-foreground/20 rounded-md w-4/6"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center p-2 hover:bg-muted-foreground/10 rounded-lg transition-colors cursor-pointer">
                    <Calendar className="h-5 w-5 text-foreground" />
                    <span className="ml-2 text-muted-foreground">Age:</span>
                    <p className="ml-auto font-medium">{userAge || "Not provided"}</p>
                  </div>
                  <div className="flex items-center p-2 hover:bg-muted-foreground/10 rounded-lg transition-colors cursor-pointer">
                    <User className="h-5 w-5 text-foreground" />
                    <span className="ml-2 text-muted-foreground">Gender:</span>
                    <p className="ml-auto font-medium">{user?.gender === 'M' ? 'Male' : user?.gender === 'F' ? 'Female' : 'Not provided'}</p>
                  </div>
                  <div className="flex items-center p-2 hover:bg-muted-foreground/10 rounded-lg transition-colors cursor-pointer">
                    <Flag className="h-5 w-5 text-foreground" />
                    <span className="ml-2 text-muted-foreground">Ethnicity:</span>
                    <p className="ml-auto font-medium">{user?.nationality || "Not provided"}</p>
                  </div>
                  <div className="flex items-center p-2 hover:bg-muted-foreground/10 rounded-lg transition-colors cursor-pointer">
                    <Map className="h-5 w-5 text-foreground" />
                    <span className="ml-2 text-muted-foreground">Location:</span>
                    <p className="ml-auto font-medium">{user?.current_residence || "Not provided"}</p>
                  </div>
                </>
              )}
              <div className="mt-4 p-3 bg-secondary/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Info className="h-4 w-4 flex-shrink-0" />
                  <span>This information helps personalize your test recommendations.</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>      {recommendations && recommendations.recommended_tests.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <span>Recommended Tests</span>
              {recommendations.fallback && (
                <span className="ml-4 text-xs font-medium px-2.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-500 rounded-full inline-flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Fallback Results
                </span>
              )}
            </h2>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Clipboard className="h-4 w-4" />
              <span>Save Results</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.recommended_tests.map((test, index) => (
              <Card key={index} className="hover:shadow-sm transition-shadow cursor-pointer">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-base font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span>{test.test_name}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="p-3 rounded-md bg-muted border border-border">
                    <p className="font-medium text-foreground mb-1 text-sm">Why this test?</p>
                    <p className="text-muted-foreground text-sm">{test.reason}</p>
                  </div>
                  <div className="flex items-start gap-2.5 text-sm">
                    <span className="bg-secondary p-1.5 rounded-full flex-shrink-0">
                      <FileText className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="font-medium text-foreground text-sm">Additional Notes</p>
                      <p className="text-muted-foreground text-sm">{test.notes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="mt-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Medical Disclaimer</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{recommendations.disclaimer}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
