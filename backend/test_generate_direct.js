const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ]
});

async function run() {
    try {
        const systemPrompt = `You MUST return your response as a VALID JSON OBJECT.`;
        const chatSession = model.startChat({
            generationConfig: {
                responseMimeType: "application/json",
            },
        });
        const result = await chatSession.sendMessage(`System Prompt: ${systemPrompt}\n\nUser Request: e-commerce`);
        console.log("SUCCESS");
    } catch(err) {
        console.error("ERROR CAUGHT:", err.message);
    }
}
run();
