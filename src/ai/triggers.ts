
'use server';

import { onFileCreate } from 'firebase-functions/v2/storage';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';

import { analyzeDocumentFlow } from './flows/analyze-document';
import { processGeospatialDataFlow } from './flows/process-geospatial-data';

if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();
const storage = getStorage();


// This trigger runs when a new document is created in any 'files' subcollection.
export const onFileUpload = onDocumentCreated('projects/{projectId}/files/{fileId}', async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
        console.log("No data associated with the event");
        return;
    }
    const data = snapshot.data();
    const fileId = event.params.fileId;
    const projectId = event.params.projectId;

    try {
        if (data.type === 'document' && data.storagePath) {
            // Fetch the file content from Cloud Storage
            const file = storage.bucket().file(data.storagePath);
            const fileContentBuffer = await file.download();
            const fileContent = fileContentBuffer.toString('utf-8');

            console.log(`Starting analysis for document: ${data.name}`);
            await analyzeDocumentFlow({
                projectId,
                fileId,
                fileContent,
                ownerId: data.ownerId,
            });
            console.log(`Successfully processed document: ${data.name}`);

        } else if (data.type === 'geojson') {
            console.log(`Starting processing for geojson: ${data.name}`);
            await processGeospatialDataFlow({
                projectId,
                fileId,
            });
            console.log(`Successfully processed geojson: ${data.name}`);
        }
    } catch (error) {
        console.error('Error processing file:', error);
        // Update the file document to reflect the failure
        await db.doc(`projects/${projectId}/files/${fileId}`).update({ status: 'failed' });
    }
});
