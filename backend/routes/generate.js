const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const OpenAI = require('openai');
const auth = require('../middleware/auth');
const Generation = require('../models/Generation');
const router = express.Router();

// Helper to get Gemini Model
const getGeminiModel = (modelName = "gemini-2.5-flash") => {
  console.log(`[TRACE] Initializing Gemini Model: ${modelName}`);
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing');
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ 
    model: modelName,
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ]
  });
};

router.post('/', auth, async (req, res) => {
  const { prompt } = req.body;
  console.log(`[TRACE] Incoming prompt: "${prompt}" from user: ${req.user?.id}`);

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    let model;
    try {
        model = getGeminiModel("gemini-2.5-flash");
    } catch (err) {
        console.warn(`[TRACE] gemini-2.5-flash failed, falling back to gemini-2.5-pro. Error: ${err.message}`);
        model = getGeminiModel("gemini-2.5-pro");
    }

    const systemPrompt = `
      You are a world-class Software Architect. Your task is to design a system based on product requirements.
      You MUST return your response as a VALID JSON OBJECT.
      The JSON MUST follow this EXACT structure:
      {
        "hld": {
          "components": [{"id": "string", "name": "string", "description": "string"}],
          "relations": [{"from": "string", "to": "string", "label": "string"}]
        },
        "lld": {
          "patterns": ["string"],
          "techStack": ["string"],
          "services": [{"name": "string", "responsibilities": ["string"]}]
        },
        "dbSchema": {
          "tables": [{"name": "string", "columns": [{"name": "string", "type": "string"}]}]
        },
        "apis": [{"method": "GET | POST | PUT | DELETE", "path": "string", "description": "string"}],
        "diagramData": {
          "nodes": [{"id": "string", "data": {"label": "string"}}],
          "edges": [{"id": "string", "source": "string", "target": "string"}]
        },
        "scalability": ["string"]
      }
      Do not include any text outside the JSON block. Ensure "apis" is always populated.
    `;

    let result;
    let cleanJson;
    
    try {
        const chatSession = model.startChat({
            generationConfig: { responseMimeType: "application/json" },
        });
        console.log(`[TRACE] Sending message to Gemini (Primary Model)...`);
        result = await chatSession.sendMessage(`System Prompt: ${systemPrompt}\n\nUser Request: ${prompt}`);
        cleanJson = result.response.text().replace(/```json|```/g, '').trim();
    } catch (primaryErr) {
        console.warn(`[WARN] Primary Gemini model failed: ${primaryErr.message}. Falling back to gemini-2.5-pro...`);
        try {
            const fallbackModel = getGeminiModel("gemini-2.5-pro");
            const fallbackSession = fallbackModel.startChat({
                generationConfig: { responseMimeType: "application/json" },
            });
            result = await fallbackSession.sendMessage(`System Prompt: ${systemPrompt}\n\nUser Request: ${prompt}`);
            cleanJson = result.response.text().replace(/```json|```/g, '').trim();
        } catch (secondaryErr) {
            console.warn(`[WARN] Secondary Gemini model failed: ${secondaryErr.message}. Falling back to OPENAI!`);
            
            if (!process.env.OPENAI_API_KEY) {
                throw new Error("Gemini Quota Exceeded and OPENAI_API_KEY is missing. Cannot failover.");
            }
            
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            console.log(`[TRACE] Requesting OpenAI gpt-4o-mini generation...`);
            const aiResponse = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                response_format: { type: "json_object" },
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
            });
            
            if (!aiResponse.choices[0]?.message?.content) {
                throw new Error('OpenAI returned an empty response.');
            }
            cleanJson = aiResponse.choices[0].message.content.replace(/```json|```/g, '').trim();
        }
    }
    
    if (!cleanJson) {
       throw new Error('All AI providers failed to return a response.');
    }

    console.log(`[TRACE] Parsing generated JSON...`);
    const architecture = JSON.parse(cleanJson);

    console.log(`[TRACE] Saving generation to database...`);
    const newGeneration = new Generation({
      userId: req.user.id,
      prompt,
      architecture,
    });
    await newGeneration.save();

    console.log(`[TRACE] Generation complete and saved.`);
    res.json(architecture);
  } catch (err) {
    console.error('[TRACE] Gemini Route Catch:', err.message);
    
    let status = 500;
    let message = 'Error generating architecture.';

    if (err.message?.includes('API key not valid')) {
        message = 'Invalid Gemini API Key. Please check your .env file.';
    } else if (err.message?.toLowerCase().includes('safety')) {
        message = 'AI Safety Block: The prompt or response was flagged by Gemini filters.';
    } else if (err.message?.toLowerCase().includes('quota') || err.message?.includes('429')) {
        message = 'Gemini Rate Limit / Quota Exceeded. You have made too many requests in a short time.';
    } else if (err.message?.includes('503')) {
        message = 'Google Gemini API is currently overloaded (503 Service Unavailable). Please try again in 30 seconds.';
    } else {
        message = `Gemini API Error: ${err.message}`;
    }

    res.status(status).json({ 
        message, 
        error: err.message,
        details: err.stack
    });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const history = await Generation.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
