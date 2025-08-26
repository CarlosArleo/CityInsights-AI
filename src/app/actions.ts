
"use server";

import { analyzeDocumentFlow, AnalyzeDocumentInput } from "@/ai/flows/analyze-document";
import { processGeospatialDataFlow, ProcessGeoJsonInput } from "@/ai/flows/process-geospatial-data";
import { analyzeEquityRiskFlow, AnalyzeEquityRiskInput, AnalyzeEquityRiskOutput } from "@/ai/flows/equity-risk-analysis";

// Create and export a Server Action for each flow
export async function analyzeDocumentAction(input: AnalyzeDocumentInput) {
  return await analyzeDocumentFlow(input);
}

export async function processGeospatialDataAction(input: ProcessGeoJsonInput) {
  return await processGeospatialDataFlow(input);
}

export async function analyzeEquityRiskAction(input: AnalyzeEquityRiskInput): Promise<AnalyzeEquityRiskOutput> {
  return await analyzeEquityRiskFlow(input);
}
