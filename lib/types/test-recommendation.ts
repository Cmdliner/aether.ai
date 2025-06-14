// Types for test recommendation API
export interface TestRecommendationRequest {
  age?: number;
  gender?: string;
  race?: string;
  location?: string;
  symptoms: string;
}

export interface RecommendedTest {
  test_name: string;
  reason: string;
  notes: string;
}

export interface TestRecommendationResponse {
  recommended_tests: RecommendedTest[];
  disclaimer: string;
  fallback?: boolean; // Flag to indicate if these are fallback recommendations
  error?: string;     // Optional error message if there was an issue
}
