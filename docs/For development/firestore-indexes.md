# Firestore Index Configuration

This document serves as the source of truth for the project's Cloud Firestore index configuration. All indexes required by the application are defined in the `firestore.indexes.json` file at the root of the repository and are deployed automatically.

## How to View Indexes in the Console

1.  Navigate to the **Firestore Database** section in the Firebase Console.
2.  Click on the **Indexes** tab.
3.  You will see two tabs:
    *   **Composite**: This lists indexes for top-level collections.
    *   **Collection group**: This lists indexes that apply to all sub-collections with a specific ID (e.g., all `reviews` sub-collections across all projects).

---

## Index Definitions

### 1. Index on `projects` (Composite)

-   **Purpose**: Enables the main dashboard query to fetch all projects owned by the currently logged-in user, sorted by creation date.
-   **File Requiring Index**: `src/app/dashboard/page.tsx`
-   **Query**: `query(collection(db, 'projects'), where('ownerId', '==', user.uid), orderBy('createdAt', 'desc'))`
-   **Definition**:
    ```json
    {
      "collectionGroup": "projects",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "ownerId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
    ```

### 2. Index on `files` (Collection Group)

-   **Purpose**: Fetches all uploaded files associated with a specific project, sorted by date.
-   **File Requiring Index**: `src/app/project/[id]/page.tsx`
-   **Query**: `query(collection(db, 'projects', projectId, 'files'), orderBy('createdAt', 'desc'))`
-   **Definition**:
    ```json
    {
      "collectionGroup": "files",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "projectId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
    ```

### 3. Index on `reviews` (Collection Group)

-   **Purpose**: Fetches review cards for a project, filtered by their status (e.g., 'pending'). This is critical for the Human-in-the-Loop (HITL) workflow.
-   **File Requiring Index**: `src/ai/flows/equity-risk-analysis.ts`
-   **Query**: `reviewsRef.where('status', '==', 'accepted')`
-   **Definition**:
    ```json
    {
      "collectionGroup": "reviews",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "projectId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" }
      ]
    }
    ```

### 4. Index on `files` for Geospatial Layers (Collection Group)

-   **Purpose**: Allows the backend Disparate Impact Identification System (DIIS) to efficiently find all GeoJSON files for a project to use as spatial context.
-   **File Requiring Index**: `src/ai/flows/equity-risk-analysis.ts`
-   **Query**: `filesRef.where('type', '==', 'geojson')`
-   **Definition**:
    ```json
    {
      "collectionGroup": "files",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "type", "order": "ASCENDING" },
        { "fieldPath": "projectId", "order": "ASCENDING" }
      ]
    }
    ```

### 5. Index on `disparateImpactAnalyses` (Collection Group)

-   **Purpose**: Retrieves the history of all past DIIS analysis results for a given project, sorted by date.
-   **File Requiring Index**: Future UI components, supports `src/ai/flows/equity-risk-analysis.ts` writes.
-   **Query**: `query(collection(db, 'disparateImpactAnalyses'), where('projectId', '==', projectId), orderBy('createdAt', 'desc'))`
-   **Definition**:
    ```json
    {
      "collectionGroup": "disparateImpactAnalyses",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "projectId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
    ```
