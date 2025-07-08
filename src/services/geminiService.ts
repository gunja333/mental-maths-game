import { GoogleGenAI, GenerateImagesResponse } from "@google/genai";
import { MathQuestion } from "../types";
import { GAME_QUESTIONS_COUNT } from "../constants";

// Vite exposes environment variables via import.meta.env
const API_KEY = import.meta.env.VITE_API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const getGradeLevelPrompt = (grade: number): string => {
    let description = '';
    switch (grade) {
        case 3:
            description = "simple 2-digit addition and subtraction.";
            break;
        case 4:
            description = "2-digit multiplication and single-digit division.";
            break;
        case 5:
            description = "3-digit addition/subtraction, 2-digit multiplication, and division with remainders.";
            break;
        case 6:
            description = "operations with simple fractions (addition/subtraction) and decimals (to one decimal place).";
            break;
        case 7:
            description = "percentages, negative numbers, and order of operations (PEMDAS/BODMAS).";
            break;
        case 8:
            description = "basic algebra like solving for x in 'x + 5 = 10', and simple exponents.";
            break;
        case 9:
            description = "solving simple linear equations, and multi-step word problems.";
            break;
        default:
            description = "a mix of arithmetic operations suitable for middle school.";
            break;
    }
    return `Generate ${GAME_QUESTIONS_COUNT} mental math questions suitable for a Grade ${grade} student. The questions should cover ${description}. Do not include word problems, only numerical expressions. The answer must be a single number.`;
}


export const generateMathQuestions = async (grade: number): Promise<MathQuestion[]> => {
    if (!API_KEY) {
      throw new Error("Cannot generate questions: API Key is not configured.");
    }
    try {
        const prompt = getGradeLevelPrompt(grade);
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: `${prompt}
            
            IMPORTANT: Return the response ONLY as a valid JSON array of objects, where each object has a "question" (string) and "answer" (number) key.
            Example format: [{"question": "15 * 7", "answer": 105}, {"question": "120 - 45", "answer": 75}]`,
            config: {
                responseMimeType: "application/json",
                temperature: 0.7,
            },
        });
        
        const jsonStr = result.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        const contentToParse = match && match[2] ? match[2].trim() : jsonStr;

        const parsedData = JSON.parse(contentToParse);

        if (Array.isArray(parsedData) && parsedData.every(item => 'question' in item && 'answer' in item)) {
            return parsedData as MathQuestion[];
        } else {
            console.error("Parsed data from API is not in the expected format:", parsedData);
            throw new Error("Invalid data format received from API.");
        }
    } catch (error) {
        console.error("Error generating math questions:", error);
        // Fallback to simpler retry or error state
        throw new Error("Could not generate questions. Please try again later.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    if (!API_KEY) {
      throw new Error("Cannot generate image: API Key is not configured.");
    }
    try {
        const response: GenerateImagesResponse = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
        });

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        if (!base64ImageBytes) {
            throw new Error("API did not return image data.");
        }
        return base64ImageBytes;

    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Could not generate the image. Please try again later.");
    }
};