
"use server";

import { analyzeEquityRiskFlow, AnalyzeEquityRiskInput, AnalyzeEquityRiskOutput } from "@/ai/flows/equity-risk-analysis";

// This file is now only for actions that NEED to be called directly from the client.
// Document and GeoJSON processing are now handled by backend triggers, so their actions are removed.

export async function analyzeEquityRiskAction(input: AnalyzeEquityRiskInput): Promise<AnalyzeEquityRiskOutput> {
  return await analyzeEquityRiskFlow(input);
}
