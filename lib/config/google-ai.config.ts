import "server-only";

import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { TestRecommendationRequest } from "../types/test-recommendation";

// Initialize the Google Generative AI client
export const genAI = new GoogleGenAI({apiKey: process.env.GOOGLE_AI_API_KEY!});

// Define available models in order of preference
export const availableModels = ["gemini-1.5-flash"];

// Default generation configuration - export for reuse
export const defaultGenerationConfig = {
  temperature: 0.4,
  topK: 32,
  topP: 0.95,
  maxOutputTokens: 8192,
};

// Default safety settings - export for reuse
export const defaultSafetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  }
];

/**
 * Function to get a working model, trying different models if necessary
 * @returns An object containing the name of the working model
 */
export async function getWorkingModel() {
  // Try models in order until one works
  for (const modelName of availableModels) {
    try {
      // Make a test call to see if the model is working
      const result = await genAI.models.generateContent({
        model: modelName,
        contents: "Test"
      });
      
      console.log(`Successfully connected to model: ${modelName}`);
      return { model: modelName };
    } catch (error) {
      console.error(`Error with model ${modelName}:`, error);
    }
  }
  
  // If all models failed, return the default anyway
  console.warn("All models failed, using default model as fallback");
  return { model: availableModels[0] };
}

/**
 * Creates a prompt for the AI to generate test recommendations based on user data
 * @param userData User data containing symptoms and optional demographic information
 * @returns A formatted prompt string for the AI model
 */
export function createTestRecommendationPrompt(userData: TestRecommendationRequest): string {
  return `
You are an AI-powered medical lab assistant embedded within a trusted healthcare application. 

Your role is to **analyze user-provided information and suggest relevant, non-alarming medical laboratory tests** that may assist in further diagnosis by healthcare professionals.

---

**⚠️ Important Constraints:**
- You are **not a medical doctor**
- Do not provide a diagnosis
- Your responses are **informational and suggestive only**
- Ensure your tone is **calm, neutral, and professional**
- Avoid alarmist or emotionally triggering language

---

**🧑‍⚕️ User Context:**
- Age: ${userData.age || "Not provided"}
- Gender: ${userData.gender || "Not provided"}
- Nationality/Race: ${userData.race || "Not provided"}
- Current Location: ${userData.location || "Not provided"}
- Reported Symptoms: "${userData.symptoms}"

Please consider:
- Conditions known to affect people of similar **age**, **gender**, or **ethnic background**
- **Endemic illnesses** associated with the user’s current location
- Known associations between **reported symptoms** and lab tests

---

**🎯 Your Task:**

1. Suggest a list of potential **medical lab tests** based on the user's input.
2. For each test:
   - Provide a **brief explanation** of what the test checks for.
   - Explain **why** the test is being recommended, based on the user’s symptoms or context.
   - Use reassuring language to emphasize that this is only a **preliminary suggestion** and not a diagnosis.

---

**📝 Output Format (JSON only):**

CRITICAL INSTRUCTIONS:
1. Return RAW JSON only 
2. NO code fences (do not use \`\`\`json or \`\`\` tags)
3. NO markdown formatting
4. Begin your response with the opening curly brace "{"
5. End your response with the closing curly brace "}"

{
  "recommended_tests": [
    {
      "test_name": "Complete Blood Count (CBC)",
      "reason": "User reported fatigue and dizziness, which can be associated with anemia or infection. CBC helps detect abnormalities in blood components.",
      "notes": "This is a common initial test and does not indicate any specific illness on its own."
    },
    {
      "test_name": "Malaria Rapid Diagnostic Test",
      "reason": "User is currently in a malaria-endemic region and reported fever and chills. This test helps check for malaria parasites.",
      "notes": "This is a routine test for symptomatic individuals in certain geographic areas."
    }
  ],
  "disclaimer": "These test suggestions are AI-generated and for informational purposes only. Always consult a certified healthcare provider for medical advice or diagnosis."
}
`;
}