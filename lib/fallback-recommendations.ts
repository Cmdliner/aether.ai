// Fallback test recommendations when the API is unavailable
import { TestRecommendationResponse } from "./types/test-recommendation";

export const getFallbackRecommendations = (symptoms: string): TestRecommendationResponse => {
  return {
    recommended_tests: [
      {
        test_name: "Complete Blood Count (CBC)",
        reason: "This is a common baseline test that provides information about overall health, including signs of infection, anemia, and other potential health issues.",
        notes: "Recommended as a standard first test when symptoms are present."
      },
      {
        test_name: "Basic Metabolic Panel (BMP)",
        reason: "Helps assess kidney function, electrolyte levels, and blood sugar levels, which can be affected by various health conditions.",
        notes: "This test can provide insight into several body systems and potential issues."
      },
    ],
    disclaimer: "SYSTEM NOTICE: These are fallback test recommendations provided when our AI service is temporarily unavailable. These are generic suggestions only and not personalized to your symptoms. Please consult a healthcare provider for proper medical advice."
  };
};
