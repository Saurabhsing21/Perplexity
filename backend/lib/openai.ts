import OpenAI from "openai";

export const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",

    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", // Your app URL
        "X-Title": "My AI App",                  // Your app name
    },
});