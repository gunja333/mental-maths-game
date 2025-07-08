
import { GoogleGenAI } from "@google/genai";
import { MathQuestion } from "../types";
import { GAME_QUESTIONS_COUNT } from "../constants";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // This is a placeholder for development.
  // In a real deployed environment, process.env.API_KEY would be set.
  console.error("API_KEY is not set. Please set the API_KEY environment variable.");
}

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
        const parsedData = JSON.parse(jsonStr);

        if (Array.isArray(parsedData) && parsedData.every(item => 'question' in item && 'answer' in item)) {
            return parsedData as MathQuestion[];
        } else {
            throw new Error("Invalid data format received from API.");
        }
    } catch (error) {
        console.error("Error generating math questions:", error);
        // Fallback to simpler retry or error state
        throw new Error("Could not generate questions. Please try again later.");
    }
};
