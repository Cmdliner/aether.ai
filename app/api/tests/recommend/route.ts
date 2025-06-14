import { NextRequest, NextResponse } from "next/server";
import { 
    getWorkingModel, 
    createTestRecommendationPrompt, 
    genAI,
    defaultSafetySettings,
    defaultGenerationConfig
} from "@/lib/config/google-ai.config";
import {
    TestRecommendationRequest,
    TestRecommendationResponse
} from "@/lib/types/test-recommendation";
import { retry } from "@/lib/retry";
import { getFallbackRecommendations } from "@/lib/fallback-recommendations";

export const runtime = "edge";

export async function POST(req: NextRequest) {
    let userSymptoms = ""; // Keep track of symptoms for fallback

    try {
        // Parse the request body
        const userData: TestRecommendationRequest = await req.json();

        // Validate that symptoms are provided
        if (!userData.symptoms) {
            return NextResponse.json(
                { error: "Symptoms are required for test recommendations" },
                { status: 400 }
            );
        }

        // Store symptoms for potential fallback
        userSymptoms = userData.symptoms.trim();

        // Clean up and sanitize the user data
        const sanitizedUserData: TestRecommendationRequest = {
            symptoms: userSymptoms,
            age: typeof userData.age === 'number' ? userData.age : undefined,
            gender: userData.gender ? userData.gender.trim() : '',
            race: userData.race ? userData.race.trim() : '',
            location: userData.location ? userData.location.trim() : ''
        };
        // Create prompt with sanitized user data
        const promptText = createTestRecommendationPrompt(sanitizedUserData);
        
        // Get a working AI model
        const { model: modelName } = await getWorkingModel();        // Use retry mechanism for the API call
        const result = await retry(async () => {
            // Generate content using the models API
            const response = await genAI.models.generateContent({
              model: modelName,
              contents: promptText
            });
            
            return response;
        }, 3, 1000, 2);
          // Get the text from the response
        let text = result.text || '';

        console.log({text});        // Clean up the text by removing any Markdown code fences or other formatting
        // First, try to extract JSON using regex if it's wrapped in code blocks
        const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch && jsonMatch[1]) {
            text = jsonMatch[1];
        } else {
            // Otherwise just remove any markdown code fence indicators
            text = text.replace(/```json\s*|```\s*|`/g, '');
        }
        
        // Parse the JSON response from the AI
        try {
            const parsedResponse: TestRecommendationResponse = JSON.parse(text.trim());
            return NextResponse.json(parsedResponse, { status: 200 });
        } catch (error) {
            console.error("Failed to parse AI response as JSON:", error);
            
            // If parsing fails, use fallback
            const fallback = getFallbackRecommendations(userSymptoms);
            return NextResponse.json({
                ...fallback,
                fallback: true,
                error: "Failed to parse AI response"
            }, { status: 200 });
        }
    } catch (error) {
        console.error("Error generating test recommendations:", error);
            
        // Use fallback recommendations with the symptoms we captured (or default)
        const fallback = getFallbackRecommendations(userSymptoms || "general symptoms");
        
        // Add a note to the first recommendation to indicate this is using fallback data
        if (fallback.recommended_tests.length > 0) {
            fallback.recommended_tests[0].notes = 
                `${fallback.recommended_tests[0].notes} NOTE: These are fallback recommendations due to a temporary AI service issue.`;
        }
        
        // Return fallback recommendations with 200 status but indicate in the response 
        // that these are fallback results
        return NextResponse.json({
            ...fallback,
            fallback: true
        }, { status: 200 });
    }
}
