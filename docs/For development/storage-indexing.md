# Cloud Storage and Indexing

A common point of confusion is how to perform efficient queries on files stored in Cloud Storage. This document clarifies the pattern used in this project.

## Why Cloud Storage Has No "Indexes"

Unlike a database like Cloud Firestore, Cloud Storage is an object storage system. It does not have built-in query capabilities or indexes. You can list objects by their full path or by a prefix, but you cannot ask it complex questions like "find all files of type 'pdf' created last week."

## The "Index via Firestore Metadata" Pattern

To solve this, we use a standard best practice: we create a metadata document in Firestore for every object we upload to Cloud Storage. This Firestore collection then acts as our powerful, queryable index for the objects.

In our application, the `files` sub-collection within each project serves this exact purpose.

### How It Works

1.  **File Upload**: When a user uploads a file (`document.pdf`) to Cloud Storage, it is saved to a structured path, like `projects/{projectId}/document.pdf`.
2.  **Metadata Creation**: Immediately after the upload is complete, the client-side code in `src/components/project/DataManagement.tsx` creates a new document in the `projects/{projectId}/files` sub-collection in Firestore.
3.  **Metadata Content**: This Firestore document contains all the information we might want to query, such as:
    *   `name`: "document.pdf"
    *   `projectId`: The ID of the parent project.
    *   `type`: "pdf"
    *   `status`: "uploaded", "analyzing", "complete"
    *   `storagePath`: The full path to the object in the Storage bucket.
    *   `url`: The public-facing download URL.
    *   `createdAt`: A timestamp of when it was uploaded.
4.  **Querying**: When the UI needs to display a list of documents or geospatial layers, it **queries the `files` Firestore collection**, not Cloud Storage. Because we have Firestore indexes on fields like `projectId`, `type`, and `createdAt`, these queries are extremely fast and efficient.

This pattern gives us the best of both worlds: the cost-effective bulk storage of Cloud Storage and the powerful querying capabilities of Cloud Firestore.
