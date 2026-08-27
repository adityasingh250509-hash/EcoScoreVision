import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialization of Gemini client to prevent startup crashes when API key is not yet set
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // Health check endpoint for Cloud Run and monitoring
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Official baseline emission factors:
  // * Air Conditioner: 1.5 kg CO2 per hour
  // * Petrol Car: 0.12 kg CO2 per km
  // * Diesel Car: 0.14 kg CO2 per km
  // * Grid Electricity: 0.82 kg CO2 per kWh

  // API Endpoint for image analysis using gemini-3.7-flash
  app.post("/api/analyze-image", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: "No image provided" });
      }

      // Verify API Key
      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({
          error: "GEMINI_API_KEY is not configured in the workspace secrets. Please open 'Settings' > 'Secrets', add your 'GEMINI_API_KEY', and click 'Restart Dev Server'. Alternatively, you can test the application instantly by selecting any of the pre-loaded baseline samples below!"
        });
      }

      const ai = getAiClient();

      // Clean base64 string if it contains prefix
      let base64Data = image;
      let mimeType = "image/jpeg";
      
      if (image.includes(";base64,")) {
        const parts = image.split(";base64,");
        mimeType = parts[0].split(":")[1] || "image/jpeg";
        base64Data = parts[1];
      }

      const imagePart = {
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      };

      const textPart = {
        text: "Identify the appliance, vehicle, or item in this image. Estimate a typical/standard consumption quantity (e.g., standard daily hours for appliances, typical travel distance in km for transport, or average kWh for energy) and its corresponding carbon emission factor (kg CO2 per unit). Return ONLY a valid JSON object with the following structure: {\"item_name\": \"string\", \"category\": \"appliance|transport|energy|waste\", \"default_unit\": \"hours|km|kWh\", \"estimated_quantity\": number, \"estimated_factor\": number, \"factor_label\": \"string\"}. Provide highly realistic estimates (e.g. typical car is 50 km and 0.12 kg/km; typical AC is 8 hours and 1.5 kg/hour; typical refrigerator is 24 hours and 0.15 kg/hour, etc.).",
      };

      let response;
      try {
        // Primary attempt: use standard gemini-3.7-flash with schema
        response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: { parts: [imagePart, textPart] },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                item_name: { 
                  type: Type.STRING, 
                  description: "The common name of the identified item, vehicle, or appliance." 
                },
                category: { 
                  type: Type.STRING, 
                  description: "Must be exactly one of: appliance, transport, energy, waste" 
                },
                default_unit: { 
                  type: Type.STRING, 
                  description: "Must be exactly one of: hours, km, kWh" 
                },
                estimated_quantity: {
                  type: Type.NUMBER,
                  description: "An estimated typical consumption value (e.g., typical travel distance or hours)."
                },
                estimated_factor: {
                  type: Type.NUMBER,
                  description: "An estimated carbon coefficient (kg CO2 per unit)."
                },
                factor_label: {
                  type: Type.STRING,
                  description: "A description of the emission factor model used."
                }
              },
              required: ["item_name", "category", "default_unit", "estimated_quantity", "estimated_factor", "factor_label"]
            }
          }
        });
      } catch (err1: any) {
        console.warn("First API structure on gemini-3.7-flash failed, retrying on gemini-3.1-flash-lite:", err1?.message || err1);
        try {
          // Second attempt: fallback to gemini-3.1-flash-lite with schema
          response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: { parts: [imagePart, textPart] },
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  item_name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  default_unit: { type: Type.STRING },
                  estimated_quantity: { type: Type.NUMBER },
                  estimated_factor: { type: Type.NUMBER },
                  factor_label: { type: Type.STRING }
                },
                required: ["item_name", "category", "default_unit", "estimated_quantity", "estimated_factor", "factor_label"]
              }
            }
          });
        } catch (err2: any) {
          console.warn("Second structured format failed, retrying without strict responseSchema:", err2?.message || err2);
          // Third attempt: gemini-3.7-flash without responseSchema
          response = await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: {
              parts: [
                imagePart,
                { text: "Identify the appliance, vehicle, or item in this image. Estimate standard usage quantity and emission factor. Return ONLY a valid JSON object. Do not include markdown code blocks or backticks. Structure: {\"item_name\": \"string\", \"category\": \"appliance|transport|energy|waste\", \"default_unit\": \"hours|km|kWh\", \"estimated_quantity\": 8, \"estimated_factor\": 1.5, \"factor_label\": \"Standard AC Unit\"}" }
              ]
            }
          });
        }
      }

      let text = response.text;
      if (!text) {
        throw new Error("Empty response received from Gemini API");
      }

      // Clean up potential markdown formatting backticks
      text = text.trim();
      if (text.startsWith("```")) {
        text = text.replace(/^```(json)?/, "").replace(/```$/, "").trim();
      }

      const result = JSON.parse(text);
      return res.json(result);

    } catch (error: any) {
      console.error("Error in /api/analyze-image:", error);
      let userMsg = error.message || "Failed to analyze image with AI";
      if (userMsg.includes("API_KEY") || userMsg.includes("api key") || userMsg.includes("API key")) {
        userMsg = "The configured Gemini API Key is missing or invalid. Please open Settings > Secrets, add/verify your GEMINI_API_KEY, restart the server, or try using the preloaded baseline samples below.";
      }
      return res.status(500).json({ error: userMsg });
    }
  });

  // Endpoint for customized advice
  app.post("/api/get-advice", async (req, res) => {
    try {
      const { item_name, category, quantity, unit, emissions, tree_offset } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing");
      }

      const ai = getAiClient();

      const prompt = `As an environmental climate expert, provide 3 short, specific, highly actionable bullet points with mitigation advice and tree offset recommendations based on the following:
Item detected: ${item_name}
Category: ${category}
User usage: ${quantity} ${unit}
Calculated CO2 emissions: ${emissions} kg CO2
Tree offset targets: ${tree_offset} trees (since 1 tree sequesters ~20kg CO2 per year).

Format your output as a JSON array of 3 strings. Avoid markdown inside the strings, just clear, crisp advice.`;

      let response;
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              }
            }
          }
        });
      } catch (err1: any) {
        console.warn("First advice attempt on gemini-3.7-flash failed, retrying on gemini-3.1-flash-lite:", err1?.message || err1);
        try {
          response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING
                }
              }
            }
          });
        } catch (err2) {
          console.warn("Second advice attempt failed, retrying without strict schema:", err2);
          response = await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: prompt + " Your response MUST be a raw JSON array of 3 strings, with no markdown codeblocks."
          });
        }
      }

      let text = response.text;
      if (!text) {
        throw new Error("Empty response received from advice Gemini API");
      }

      text = text.trim();
      if (text.startsWith("```")) {
        text = text.replace(/^```(json)?/, "").replace(/```$/, "").trim();
      }

      const advice = JSON.parse(text);
      return res.json({ advice });
    } catch (error: any) {
      console.error("Error getting advice:", error);
      return res.json({
        advice: [
          `Consider reducing your usage of ${req.body.item_name || 'this item'} to lower the ${req.body.emissions || 0} kg CO2 footprint.`,
          `Plant at least ${req.body.tree_offset || 1} tree(s) to completely offset this carbon impact over the coming year.`,
          "Transition to renewable energy sources or energy-efficient models to prevent future climate footprint peaks."
        ]
      });
    }
  });

  // In-memory cache for climate news with TTL (3 hours)
  interface CachedNews {
    data: any[];
    timestamp: number;
  }

  let newsCache: CachedNews | null = null;
  const CACHE_TTL = 3 * 60 * 60 * 1000;

  const DEFAULT_FALLBACK_NEWS = [
    {
      title: "Global Renewable Capacity Grew by Record 50% in Last Year",
      summary: "Solar and wind energy installations are expanding at their fastest rate in history, keeping the goal of tripling clean capacity by 2030 within reach.",
      url: "https://www.iea.org"
    },
    {
      title: "New Battery Technology Breakthrough Doubles Energy Density",
      summary: "Engineers have successfully developed solid-state lithium batteries that charge faster, last longer, and cut cobalt usage significantly.",
      url: "https://www.sciencedaily.com"
    },
    {
      title: "Over 100 Countries Commit to Massive Forest Restoration Programs",
      summary: "Governments around the globe have pledged new funds to restore millions of hectares of degraded ecosystems by the end of the decade.",
      url: "https://www.unep.org"
    }
  ];

  // Endpoint for climate news with search grounding
  app.get("/api/climate-news", async (req, res) => {
    const forceRefresh = req.query.refresh === "true";
    const now = Date.now();

    if (!forceRefresh && newsCache && (now - newsCache.timestamp < CACHE_TTL)) {
      return res.json({ news: newsCache.data });
    }

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing");
      }

      const ai = getAiClient();

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: "Find 3 recent, highly positive, and inspiring news headlines related to climate action, renewable energy breakthroughs, or successful SDG 13 initiatives (published recently in 2025/2026). For each news item, provide the headline, a brief 1-sentence description of why it is positive, and a reliable URL to read more. Return ONLY a valid JSON array of objects with the structure: [{\"title\": \"string\", \"summary\": \"string\", \"url\": \"string\"}].",
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                url: { type: Type.STRING }
              },
              required: ["title", "summary", "url"]
            }
          }
        },
      });

      let text = response.text;
      if (!text) {
        throw new Error("Empty response received from climate news Gemini API");
      }

      text = text.trim();
      if (text.startsWith("```")) {
        text = text.replace(/^```(json)?/, "").replace(/```$/, "").trim();
      }

      const news = JSON.parse(text);
      
      newsCache = {
        data: news,
        timestamp: now
      };

      return res.json({ news });
    } catch (error: any) {
      const isQuotaError = 
        error.status === 429 || 
        error.status === "RESOURCE_EXHAUSTED" || 
        error.message?.includes("429") || 
        error.message?.toLowerCase().includes("quota") ||
        error.message?.toLowerCase().includes("limit") ||
        error.message?.toLowerCase().includes("exhausted");

      if (isQuotaError) {
        console.log("[Climate News] Gemini Quota limits reached. Serving high-quality fallback news smoothly.");
      } else {
        console.warn("[Climate News] Unable to fetch grounded search news. Using fallback.", error.message || error);
      }

      const fallbackData = newsCache ? newsCache.data : DEFAULT_FALLBACK_NEWS;
      return res.json({ news: fallbackData });
    }
  });

  // Vite middleware for dev / static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical: Failed to start server", err);
  process.exit(1);
});

