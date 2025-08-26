"use server";

import { analyzeDocument } from "@/ai/flows/analyze-document";
import { processGeospatialData } from "@/ai/flows/process-geospatial-data";
import { analyzeEquityRisk } from "@/ai/flows/equity-risk-analysis";

// Define the input types for our actions
type AnalyzeDocumentInput = {
    projectId: string;
    fileId: string;
    fileContent: string;
    ownerId: string;
};
type ProcessGeoDataInput = { projectId: string; fileId: string; };
type AnalyzeEquityRiskInput = { policyText: string; projectId: string; };


// Create and export a Server Action for each flow
export async function analyzeDocumentAction(input: AnalyzeDocumentInput) {
  return await analyzeDocument(input);
}

export async function processGeospatialDataAction(input: ProcessGeoDataInput) {
  return await processGeospatialData(input);
}

export async function analyzeEquityRiskAction(input: AnalyzeEquityRiskInput) {
  return await analyzeEquityRisk(input);
}
