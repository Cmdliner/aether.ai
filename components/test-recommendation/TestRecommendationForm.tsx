"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  FileText
} from "lucide-react";

export default function TestRecommendationForm() {
  const { user, isLoading: authLoading } = useAuth();
  
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<TestRecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userAge, setUserAge] = useState<number | null>(null);
  
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
    } catch (err: any) {
      setError(err.message || "Failed to get test recommendations");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Medical Test Recommendations</h1>
        <p className="text-muted-foreground">
          Describe your symptoms to receive AI-powered test recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-foreground text-background">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Describe Your Symptoms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="symptoms" className="flex items-center space-x-2">
                    <Stethoscope className="h-4 w-4" />
                    <span>What symptoms are you experiencing?</span>
                  </Label>
                  <div className="mt-2">
                    <div className="relative">
                      <textarea
                        id="symptoms"
                        className="w-full h-32 px-3 py-2 text-background bg-background/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Please describe your symptoms in detail. For example: I've been experiencing headaches for the past three days, along with a mild fever and fatigue."
                        required
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-background/50">
                        {symptoms.length > 0 ? `${symptoms.length} characters` : ""}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full flex items-center justify-center space-x-2 transition-all"
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
            <div className="mt-4 p-4 bg-red-100/20 border border-red-400/30 text-red-700 rounded-md flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-foreground text-background h-full">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Your Health Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {authLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-background/20 rounded"></div>
                  <div className="h-4 bg-background/20 rounded w-5/6"></div>
                  <div className="h-4 bg-background/20 rounded w-4/6"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-background/70" />
                    <span className="text-background/70">Age:</span>
                    <p className="ml-auto font-medium">{userAge || "Not provided"}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-background/70" />
                    <span className="text-background/70">Gender:</span>
                    <p className="ml-auto font-medium">{user?.gender === 'M' ? 'Male' : user?.gender === 'F' ? 'Female' : 'Not provided'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Flag className="h-4 w-4 text-background/70" />
                    <span className="text-background/70">Ethnicity:</span>
                    <p className="ml-auto font-medium">{user?.nationality || "Not provided"}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Map className="h-4 w-4 text-background/70" />
                    <span className="text-background/70">Location:</span>
                    <p className="ml-auto font-medium">{user?.current_residence || "Not provided"}</p>
                  </div>
                </>
              )}
              <p className="text-sm text-background/70 pt-2 flex items-center space-x-2">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span>This information helps personalize your test recommendations.</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {recommendations && recommendations.recommended_tests.length > 0 && (        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Recommended Tests
            {recommendations.fallback && (
              <span className="ml-2 text-sm font-normal px-2 py-1 bg-yellow-100/20 border border-yellow-400/30 text-yellow-700 rounded-full">
                Fallback Results
              </span>
            )}
          </h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.recommended_tests.map((test, index) => (
              <Card key={index} className="bg-foreground text-background">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    {test.test_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Why:</strong> {test.reason}</p>
                  <p className="text-sm text-background/70">{test.notes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/30 text-blue-100 rounded-md text-sm">
            <strong>Disclaimer:</strong> {recommendations.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
}
