import { NextResponse } from 'next/server';

// API Keys - In production, these should be in process.env
const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || "AIzaSyDyujljBbIEPf3aRx8Vg-6hUk6SmGXV07U";
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "RPI_ShB8Eaz7mPCGGS6VIoTpe9FMUYZMhJXiUrpDgYs";

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // 1. Generate Content with Google Gemini (REST API)
        // Switching to gemini-pro for better stability with v1beta endpoint
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_GEMINI_API_KEY}`;

        const systemPrompt = `
      You are an expert SEO blog writer. Write a blog post based on the user's prompt.
      You MUST return the response in valid JSON format ONLY. Do not wrap in markdown code blocks.
      
      The JSON object must have exactly these fields:
      - title: A catchy, SEO-optimized title.
      - content: The full blog post content in semantic HTML format (use <h2>, <p>, <ul>, <li>, etc., but DO NOT use <h1> or <html>/<body> tags).
      - imageKeyword: A single, specific English noun or short phrase to search for a relevant image on Unsplash (e.g., "drone", "aerospace", "technology").
      - linkedinSummary: A professional, engaging 2-3 sentence summary suitable for a LinkedIn post about this article.
      - excerpt: A short 1-2 sentence summary of the blog post.
      - tags: A comma-separated string of 3-5 relevant tags.
    `;

        const geminiPayload = {
            contents: [{
                parts: [{ text: `Write a blog post about: ${prompt}` }]
            }],
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            generationConfig: {
                // responseMimeType: "application/json" // Removed to compatibility with gemini-pro
            }
        };

        const geminiRes = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(geminiPayload)
        });

        if (!geminiRes.ok) {
            const errorText = await geminiRes.text();
            console.error("Gemini API Error:", errorText);
            throw new Error("Failed to generate content from AI");
        }

        const geminiData = await geminiRes.json();
        let aiContent;

        try {
            let textResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!textResponse) throw new Error("No content returned from Gemini");

            // Clean markdown formatting if present
            textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

            aiContent = JSON.parse(textResponse);
        } catch (parseError) {
            console.error("Failed to parse AI response:", parseError);
            throw new Error("AI returned invalid data format");
        }

        // 2. Fetch Image from Unsplash
        let imageUrl = "";
        if (aiContent.imageKeyword) {
            try {
                const unsplashUrl = `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(aiContent.imageKeyword)}&orientation=landscape&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`;
                const unsplashRes = await fetch(unsplashUrl);

                if (unsplashRes.ok) {
                    const unsplashData = await unsplashRes.json();
                    if (unsplashData.results && unsplashData.results.length > 0) {
                        imageUrl = unsplashData.results[0].urls.regular;
                    }
                } else {
                    console.error("Unsplash API Error:", await unsplashRes.text());
                }
            } catch (imgError) {
                console.error("Failed to fetch image:", imgError);
                // Non-blocking
            }
        }

        // 3. Return Final Data
        return NextResponse.json({
            success: true,
            data: {
                title: aiContent.title,
                content: aiContent.content,
                excerpt: aiContent.excerpt || aiContent.linkedinSummary,
                tags: aiContent.tags, // Keep as string if AI returns string, or handle array
                linkedinSummary: aiContent.linkedinSummary,
                featuredImage: imageUrl,
                slug: aiContent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
            }
        });

    } catch (error) {
        console.error("AI Assist API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
