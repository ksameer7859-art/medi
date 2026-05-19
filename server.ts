import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.use(express.json({ limit: '10mb' }));

// API: AI X-ray Analysis
app.post("/api/analyze-xray", async (req, res) => {
  try {
    const { image, language = "English" } = req.body;
    if (!image) return res.status(400).json({ error: "No image provided" });

    const prompt = `Analyze this X-ray image for medical findings. 
    Provide a confidence score (0-100), a list of detected suspicious areas (with hypothetical coordinates or regions),
    and a human-language explanation in ${language}.
    Format the output as JSON with the following structure:
    {
      "confidence": number,
      "findings": string,
      "suspiciousAreas": [{ "area": string, "description": string }],
      "explanation": string,
      "disclaimer": "AI assists doctors and is not a replacement for professional diagnosis."
    }`;

    const imagePart = {
      inlineData: {
        mimeType: "image/png", // Assuming base64 data:image/png;base64,...
        data: image.split(",")[1] || image,
      },
    };

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [imagePart, { text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    res.json(JSON.parse(result.text || "{}"));
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze X-ray", details: error.message });
  }
});

// API: Health Insights
app.post("/api/health-insights", async (req, res) => {
  try {
    const { history } = req.body;
    const prompt = `Based on this patient medical history, provide 3 proactive health insights and a summary.
    History: ${JSON.stringify(history)}
    Return JSON: { "summary": string, "insights": string[] }`;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    res.json(JSON.parse(result.text || "{}"));
  } catch (error) {
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

// Mock Endpoints for development
let prescriptions: any[] = [
  { 
    id: "RX-9021", 
    patientName: "Sameer", 
    doctorName: "Dr. Sarah Mitchell", 
    date: "2026-05-18", 
    medicines: [
      { name: "Amoxicillin", dosage: "500mg - Twice daily", duration: "5 Days" },
      { name: "Paracetamol", dosage: "650mg - As needed", duration: "3 Days" }
    ],
    notes: "Rest well and drink plenty of fluids. Follow up if fever persists."
  }
];

app.get("/api/prescriptions", (req, res) => {
  res.json(prescriptions);
});

app.post("/api/prescriptions", (req, res) => {
  const newPrescription = {
    id: `RX-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    ...req.body
  };
  prescriptions.unshift(newPrescription);
  res.status(201).json(newPrescription);
});

app.get("/api/appointments", (req, res) => {
  res.json([
    { id: 1, doctor: "Dr. Sarah Mitchell", specialty: "Radiologist", date: "2026-05-21", time: "10:30 AM", status: "Confirmed" },
    { id: 2, doctor: "Dr. James Wilson", specialty: "Cardiologist", date: "2026-05-25", time: "02:00 PM", status: "Pending" }
  ]);
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MediVision AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
