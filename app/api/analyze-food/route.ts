import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
    try {
        // Parse request body
        const { images, userDescription } = await request.json();

        // Input validation
        if (!images?.length && !userDescription?.trim()) {
            return NextResponse.json(
                { error: "Please provide either images or a description." },
                { status: 400 }
            );
        }

        // Prepare the system instruction
        const systemInstruction = {
            parts: [
                {
                    text: `You are a food expert. Analyze food images and descriptions to:
                        1. Identify the dish name.
                        2. Provide a 50-60 word description including:
                        - Cultural origin
                        - Key ingredients
                        - Typical preparation method
                        - Serving suggestions.
                        3. List ingredients as bullet points:
                            - Start each with "* "
                            - One ingredient per line
                            - Include measurements
                            - Note alternatives for dietary restrictions
                        4. Format instructions with:
                            - Numbered steps
                            - Step title in **bold**
                            - One step per line
                            - Exact temperatures (°F/°C)
                            - Cooking durations
                            1. **Prep Work**: 
                                - [Time] [Temperature] [Tools]
                                - Example: "**1. Mise en Place**\nChill mixing bowl for 15 minutes at -18°C"
                        5. Format response as:
                        DISH NAME: [name]
                        DESCRIPTION: [text]
                        INGREDIENTS: [line1]\n[line2]
                        INSTRUCTIONS: [step1]\n[step2]`
                }
            ]
        };

        // Prepare the request payload for the Gemini API
        const contents = [
            {
                role: "user",
                parts: [
                    { text: userDescription || "Please analyze this food." },
                    ...images.map((base64Image: string) => ({
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: base64Image.split(",")[1]
                        }
                    }))
                ]
            }
        ];

        // Call the Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    systemInstruction,
                    contents,
                    generationConfig: {
                        maxOutputTokens: 1000,
                        temperature: 0.5
                    }
                })
            }
        );

        // Handle Gemini API errors
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error:", errorData);
            return NextResponse.json(
                { error: errorData.error?.message || "Food analysis failed." },
                { status: 500 }
            );
        }

        // Parse the Gemini API response
        const result = await response.json();
        const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!textResponse) {
            return NextResponse.json(
                { error: "Invalid response from Gemini." },
                { status: 500 }
            );
        }

        // Extract information using regex
        const dishRegex = /DISH NAME:\s*(.+?)\s*DESCRIPTION:\s*([\s\S]+?)\s*INGREDIENTS:\s*([\s\S]+?)\s*INSTRUCTIONS:\s*([\s\S]+)/i;
        const match = textResponse.match(dishRegex);

        if (match) {
            // Process ingredients
            const ingredients: string[] = match[3].trim()
                .split('\n')
                .map((line: string) => line.replace(/^\s*\*\s*/, '').trim())
                .filter((line: string) => line.length > 0);

            // Process instructions
            const instructionSteps = match[4].trim().split(/(?=\d+\.)/g)
                .map((step: string) => {
                    const cleanedStep = step.trim();
                    const stepMatch = cleanedStep.match(/^(\d+)\.\s+\*\*(.*?)\*\*\s*(.*)/);
                    return {
                        number: stepMatch?.[1] || '',
                        title: stepMatch?.[2]?.trim() || '',
                        description: stepMatch?.[3]?.trim() || cleanedStep
                    };
                });

            return NextResponse.json({
                name: match[1].trim() || "Unknown Dish",
                description: match[2].trim() || "No description available",
                ingredients: ingredients,
                instructions: instructionSteps
            });
        } else {
            // Fallback parsing
            const nameMatch = textResponse.match(/DISH NAME:\s*(.+?)\n/i);
            const descriptionMatch = textResponse.match(/DESCRIPTION:\s*([\s\S]+)/i);
            return NextResponse.json({
                name: nameMatch?.[1]?.trim() || "Unknown Dish",
                description: descriptionMatch?.[1]?.trim() || textResponse,
                ingredients: [],
                instructions: []
            });
        }
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        return NextResponse.json({error: "An unexpected error occurred"}, {status: 500})
    }
}