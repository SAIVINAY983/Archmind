const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const chatSession = model.startChat({
            generationConfig: { responseMimeType: 'application/json' },
        });
        const result = await chatSession.sendMessage('Respond with a valid JSON containing { "hello": "world" }');
        console.log("2.5-flash SUCCESS:", result.response.text());
    } catch (err) {
        console.error("2.5-flash ERROR:", err.message);
    }
}

testGemini();
