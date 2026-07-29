import express, { response } from "express";
// To install: npm i @tavily/core
import { tavily } from '@tavily/core';
import { client } from './lib/openai'
import { SYSTEM_PROMPT } from "./prompt";
import { PROMPT_TEMPLATE } from "./prompt";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";


const clientt = tavily({ apiKey: process.env.TAVILY_API_KEY || '' });


const app = express();
app.use(express.json());


app.post("/ask", async (req, res) => {
    try {
        // step1- get user user query 
        const { query } = req.body;

        if (!query || typeof query !== "string") {
            console.error("[/ask] Invalid or missing query in request body:", req.body);
            return res.status(400).json({ error: "Missing or invalid query" });
        }

        console.log("[/ask] Received query:", query);

        // step2 checl for credit 
        // step3 check if we have  indexed the similer  results
        // step4 web search +tool call 
        console.log("[/ask] Starting Tavily web search...");
        const websearchresult = await clientt.search(query, {
            searchDepth: "advanced"
        });

        const websearchresponse = websearchresult.results;
        console.log("[/ask] Web search results count:", websearchresponse?.length ?? 0);

        //step5 context enginnering to put these together (prompt +web search rwesult)
        // step6 llm hit 
        const model: string = req.body.model; // User chooses model
        console.log("[/ask] Using model:", model ?? "gpt-4.1-mini (default)");

        const QuestionResponseSchema = z.object({
            followUpQuestions: z.array(z.string()),
            answer: z.string(),
        });

        function createFinalPrompt(userQuery: string, webSearchResults: any[]): string {
            return PROMPT_TEMPLATE
                .replace("{{USER_QUERY}}", userQuery)
                .replace("{{WEB_SEARCH_RESULTS}}", JSON.stringify(webSearchResults, null, 2));
        }

        console.log("[/ask] Creating OpenAI stream...");
        const stream = await client.responses.create({
            model: "gpt-4.1-mini",
            input: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT,
                },
                {
                    role: "user",
                    content: createFinalPrompt(query, websearchresponse),
                },
            ],
            text: {
                format: zodTextFormat(QuestionResponseSchema, "question_response"),
            },
            temperature: 0.2,
            stream: true,
        });
        // const question_response = response.output_parsed;

        let text = "";

        for await (const event of stream) {
            if (event.type === "response.output_text.delta") {
                text += event.delta;
                res.write(event.delta);
            }
        }


        res.write("\n------------SOURCES------------" + "\n");
        websearchresponse.forEach(result => {
            res.write(result.url + "\n");
        });


        res.end();
        console.log("[/ask] Request completed successfully");
        //step7 Stream response and followup suggestion 
    } catch (error) {
        console.error("[/ask] Error processing request:", error);

        if (!res.headersSent) {
            return res.status(500).json({
                error: "Failed to process request",
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }

        res.end();
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
}).on("error", (error) => {
    console.error("Failed to start server:", error);
});



