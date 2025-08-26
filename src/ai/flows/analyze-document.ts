
'use server';

/**
 * @fileOverview Analyzes a document to extract qualitative insights based on a predefined framework.
 *
 * - analyzeDocument - A function that handles the document analysis process.
 * - AnalyzeDocumentInput - The input type for the analyzeDocument function.
 * - KeyInsight - The structure of a single insight extracted from the document.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {doc, getDoc, updateDoc, collection, addDoc} from 'firebase/firestore';
import {db} from '@/lib/firebase/config';

// Defines the structure for a single key insight found by the AI
const KeyInsightSchema = z.object({
  insight: z
    .string()
    .describe('The specific insight or theme identified, categorized according to the framework.'),
  excerpt: z
    .string()
    .describe('The exact, verbatim quote from the text that supports this insight.'),
  category: z.enum([
    'Perceptions & Mental Models',
    'Relationships & Power Dynamics',
    'Policies, Practices, & Investments',
    'Systemic Challenges',
  ]).describe("The category from the framework that this insight falls into."),
});
export type KeyInsight = z.infer<typeof KeyInsightSchema>;

// Defines the input schema for the analysis flow
const AnalyzeDocumentInputSchema = z.object({
  projectId: z.string(),
  fileId: z.string(),
  fileContent: z.string(), // The full text content of the document
});
export type AnalyzeDocumentInput = z.infer<typeof AnalyzeDocumentInputSchema>;


const analysisPrompt = ai.definePrompt({
    name: 'documentAnalysisPrompt',
    input: { schema: z.object({ fileContent: z.string() }) },
    output: { schema: z.object({ keyInsights: z.array(KeyInsightSchema) }) },
    prompt: `You are an expert urban analyst specializing in socio-spatial and equity analysis. Your task is to analyze the provided document based on the "Masterplanning for Democracy" framework.

    Analyze the following document content:
    ---
    {{{fileContent}}}
    ---

    Identify key excerpts that fall into one of the following categories:
    - **Perceptions & Mental Models:** How people perceive and mentally map spaces. Reveals biases, community views, and societal narratives. (Keywords: believe, feel, think, perceive, view, narrative, bias)
    - **Relationships & Power Dynamics:** The web of social and political interactions. Identifies who holds power, patterns of inclusion/exclusion. (Keywords: power, influence, control, access, inequality, stakeholders)
    - **Policies, Practices, & Investments:** Formal mechanisms shaping a space like laws, regulations, and resource allocation. (Keywords: policy, law, regulation, funding, investment, budget, plan, project)
    - **Systemic Challenges:** Potential harms to vulnerable groups. (Keywords: displacement, gentrification, risk, harm, burden, inequality, vulnerable)

    For each finding, you must provide:
    1. The verbatim 'excerpt' from the document.
    2. A concise 'insight' summarizing the finding.
    3. The specific 'category' it belongs to.

    Return your analysis as a structured array of key insights.`,
});


const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    const { projectId, fileId, fileContent } = input;
    
    // Update file status to 'processing'
    const fileRef = doc(db, 'projects', projectId, 'files', fileId);
    await updateDoc(fileRef, { status: 'processing' });
    
    try {
        const { output } = await analysisPrompt({ fileContent });

        if (output && output.keyInsights) {
            const reviewsCollectionRef = collection(db, 'projects', projectId, 'reviews');
            for (const insight of output.keyInsights) {
                await addDoc(reviewsCollectionRef, {
                    ...insight,
                    projectId: projectId,
                    fileId: fileId,
                    status: 'pending', // 'pending', 'accepted', 'rejected'
                    createdAt: new Date().toISOString(),
                });
            }
        }
        
        // Update file status to 'completed'
        await updateDoc(fileRef, { status: 'completed' });

    } catch (error) {
        console.error('Error during document analysis:', error);
        // Update file status to 'failed'
        await updateDoc(fileRef, { status: 'failed' });
    }
  }
);


export async function analyzeDocument(input: AnalyzeDocumentInput) {
    return analyzeDocumentFlow(input);
}
