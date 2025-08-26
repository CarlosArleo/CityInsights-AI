# Technical Architecture for the Democratic Masterplanning AI Platform (MVP)

## Frontend
*   **Framework:** Next.js 14 with App Router
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** Shadcn/UI for pre-built, accessible components.

## Backend & Database
*   **Platform:** Firebase (Backend-as-a-Service)
*   **Authentication:** Firebase Authentication (Email/Password and Google Provider).
*   **Database:** Cloud Firestore (NoSQL). The schema is defined in `firestore_schema.md`.
*   **File Storage:** Cloud Storage for Firebase for user-uploaded documents (.pdf, .txt, .md).
*   **Serverless Functions:** Cloud Functions for Firebase (2nd Gen) written in TypeScript. This is where the core AI logic will run.

## AI Core
*   **Primary Model:** Google's Gemini 2.5 Pro, accessed via the Google AI API.
*   **Integration:** All API calls to the Gemini model MUST be handled securely within a server-side Cloud Function to protect API keys. The client-side application should never call the Gemini API directly.