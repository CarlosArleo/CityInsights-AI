
'use server';

/**
 * @fileOverview Analyzes a proposed policy for disparate impact risks.
 * - analyzeEquityRisk - A function that handles the equity risk analysis process.
 * - AnalyzeEquityRiskInput - The input type for the analyzeEquityRisk function.
 * - AnalyzeEquityRiskOutput - The return type for the analyzeEquityRisk function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {db} from '@/lib/firebase/config';

// Defines the input schema for the equity risk analysis flow
export const AnalyzeEquityRiskInputSchema = z.object({
  projectId: z.string(),
  policyText: z.string().describe('The text of the proposed policy or plan to be analyzed.'),
});
export type AnalyzeEquityRiskInput = z.infer<typeof AnalyzeEquityRiskInputSchema>;

// Defines the output schema for the analysis
export const AnalyzeEquityRiskOutputSchema = z.object({
  summary: z.string().describe('A brief one-sentence summary of the primary equity risk.'),
  keyRisks: z.array(z.string()).describe('A list of the top 3-5 key equity risks identified.'),
  recommendations: z.array(z.string()).describe('A list of actionable recommendations to mitigate the identified risks.'),
});
export type AnalyzeEquityRiskOutput = z.infer<typeof AnalyzeEquityRiskOutputSchema>;


const equityRiskPrompt = ai.definePrompt({
    name: 'equityRiskAnalysisPrompt',
    input: { schema: z.object({ 
        policyText: z.string(),
        qualitativeContext: z.string(),
        geospatialContext: z.string() 
    }) },
    output: { schema: AnalyzeEquityRiskOutputSchema },
    prompt: `You are an expert urban planning analyst with a focus on equity, justice, and disparate impact. Your task is to analyze a proposed policy based on the provided project context.

    **Proposed Policy:**
    ---
    {{{policyText}}}
    ---

    **Project Context:**
    You have access to two types of curated data for this project:

    1.  **Qualitative Context:** Key themes and direct quotes from community feedback, reports, and other documents. These represent the lived experiences and expressed concerns of stakeholders.
        ---
        {{{qualitativeContext}}}
        ---

    2.  **Geospatial Context:** A list of available geospatial data layers. This provides spatial information about the project area.
        ---
        {{{geospatialContext}}}
        ---

    **Your Analysis Task:**
    Analyze the **Proposed Policy** through the lens of the provided **Project Context**. Identify potential disparate impacts on vulnerable populations.

    Structure your response as follows:
    -   **summary:** A single, concise sentence summarizing the most significant equity risk.
    -   **keyRisks:** A bulleted list of the top 3-5 potential negative impacts.
    -   **recommendations:** A bulleted list of actionable recommendations to mitigate these risks.`,
});


const analyzeEquityRiskFlow = ai.defineFlow(
  {
    name: 'analyzeEquityRiskFlow',
    inputSchema: AnalyzeEquityRiskInputSchema,
    outputSchema: AnalyzeEquityRiskOutputSchema,
  },
  async ({ projectId, policyText }) => {
    // 1. Fetch accepted qualitative reviews
    const reviewsQuery = query(
      collection(db, 'projects', projectId, 'reviews'),
      where('status', '==', 'accepted')
    );
    const reviewsSnapshot = await getDocs(reviewsQuery);
    const qualitativeContext = reviewsSnapshot.docs.map(doc => `- ${doc.data().insight} (Source: "${doc.data().excerpt}")`).join('\n');

    // 2. Fetch available geospatial layers
    const filesQuery = query(
        collection(db, 'projects', projectId, 'files'),
        where('type', '==', 'geojson')
    );
    const filesSnapshot = await getDocs(filesQuery);
    const geospatialContext = filesSnapshot.docs.map(doc => `- ${doc.data().name}`).join('\n');
    
    // 3. Call the AI prompt with the synthesized context
    const { output } = await equityRiskPrompt({
        policyText,
        qualitativeContext: qualitativeContext || "No qualitative insights have been accepted for this project yet.",
        geospatialContext: geospatialContext || "No geospatial data has been uploaded for this project yet.",
    });

    if (!output) {
      throw new Error('The AI model did not return a valid analysis.');
    }

    return output;
  }
);

export async function analyzeEquityRisk(input: AnalyzeEquityRiskInput): Promise<AnalyzeEquityRiskOutput> {
    return analyzeEquityRiskFlow(input);
}
