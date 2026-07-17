import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json({ limit: "15mb" }));

// Official baseline emission factors:
// * Air Conditioner: 1.5 kg CO2 per hour
// * Petrol Car: 0.12 kg CO2 per km
// * Diesel Car: 0.14 kg CO2 per km
// * Grid Electricity: 0.82 kg CO2 per kWh

// API Endpoint for image analysis using gemini-3.5-flash
app.post("/api/analyze-image", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

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
      text: "Identify the appliance, vehicle, or item in this image. Return ONLY a valid JSON object with the following structure: {\"item_name\": \"string\", \"category\": \"appliance|transport|energy|waste\", \"default_unit\": \"hours|km|kWh\"}.",
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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
            }
          },
          required: ["item_name", "category", "default_unit"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from Gemini API");
    }

    const result = JSON.parse(text.trim());
    return res.json(result);

  } catch (error: any) {
    console.error("Error in /api/analyze-image:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze image with AI" });
  }
});

// Endpoint for customized advice
app.post("/api/get-advice", async (req, res) => {
  try {
    const { item_name, category, quantity, unit, emissions, tree_offset } = req.body;
    
    const prompt = `As an environmental climate expert, provide 3 short, specific, highly actionable bullet points with mitigation advice and tree offset recommendations based on the following:
Item detected: ${item_name}
Category: ${category}
User usage: ${quantity} ${unit}
Calculated CO2 emissions: ${emissions} kg CO2
Tree offset targets: ${tree_offset} trees (since 1 tree sequesters ~20kg CO2 per year).

Format your output as a JSON array of 3 strings. Avoid markdown inside the strings, just clear, crisp advice.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from advice Gemini API");
    }

    const advice = JSON.parse(text.trim());
    return res.json({ advice });
  } catch (error: any) {
    console.error("Error getting advice:", error);
    // Provide general fallback advice if Gemini fails
    return res.json({
      advice: [
        `Consider reducing your usage of ${req.body.item_name || 'this item'} to lower the ${req.body.emissions || 0} kg CO2 footprint.`,
        `Plant at least ${req.body.tree_offset || 1} tree(s) to completely offset this carbon impact over the coming year.`,
        "Transition to renewable energy sources or energy-efficient models to prevent future climate footprint peaks."
      ]
    });
  }
});

// Vite middleware setup and server startup wrapped in async flow to prevent CJS compilation errors
async function initVite() {
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
}

initVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}).catch((err) => {
  console.error("Critical: Failed to initialize Vite middleware", err);
});
