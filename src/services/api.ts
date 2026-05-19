import { XrayAnalysisResponse } from "../types.ts";

export const analyzeXray = async (image: string, language: string = "English"): Promise<XrayAnalysisResponse> => {
  const response = await fetch("/api/analyze-xray", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image, language }),
  });
  if (!response.ok) throw new Error("Analysis failed");
  return response.json();
};

export const getAppointments = async (): Promise<any[]> => {
  const response = await fetch("/api/appointments");
  return response.json();
};

export const fetchHealthInsights = async (history: any): Promise<any> => {
  const response = await fetch("/api/health-insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history }),
  });
  return response.json();
};

export const getPrescriptions = async (): Promise<any[]> => {
  const response = await fetch("/api/prescriptions");
  return response.json();
};

export const createPrescription = async (data: any): Promise<any> => {
  const response = await fetch("/api/prescriptions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};
