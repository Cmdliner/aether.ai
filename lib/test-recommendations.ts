import { TestRecommendationRequest, TestRecommendationResponse } from "./types/test-recommendation";

/**
 * Calls the API to get test recommendations based on user-provided symptoms and demographics
 * @param userData User data containing symptoms and optional demographic information
 * @returns A promise resolving to the test recommendation response
 */
export async function getTestRecommendations(
  userData: TestRecommendationRequest
): Promise<TestRecommendationResponse> {
  try {
    const response = await fetch("/api/tests/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to get test recommendations");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting test recommendations:", error);
    throw error;
  }
}
