
'use server';

/**
 * @fileOverview Processes an uploaded GeoJSON file.
 * This flow simply updates the file status to "completed" to provide user feedback.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {doc, updateDoc} from 'firebase/firestore';
import {db} from '@/lib/firebase/config';

// Defines the input schema for the flow
const ProcessGeoJsonInputSchema = z.object({
  projectId: z.string(),
  fileId: z.string(),
});
export type ProcessGeoJsonInput = z.infer<typeof ProcessGeoJsonInputSchema>;

const processGeospatialDataFlow = ai.defineFlow(
  {
    name: 'processGeospatialDataFlow',
    inputSchema: ProcessGeoJsonInputSchema,
    outputSchema: z.void(),
  },
  async ({ projectId, fileId }) => {
    const fileRef = doc(db, 'projects', projectId, 'files', fileId);
    
    await updateDoc(fileRef, { status: 'processing' });
    
    // In a real application, you might do some validation or processing here.
    // For now, we just mark it as completed to show it's ready.
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
    
    await updateDoc(fileRef, { status: 'completed' });
  }
);

export async function processGeospatialData(input: ProcessGeoJsonInput) {
    return processGeospatialDataFlow(input);
}
