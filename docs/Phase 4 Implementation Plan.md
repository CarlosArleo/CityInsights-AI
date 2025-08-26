# Design Document: Phase 4 Implementation Plan

This document outlines the features and technical plan required to complete Phase 4 of the Democratic Masterplanning AI Platform, as described in the project's vision document (`AI for Democratic Urban Masterplanning.txt`).

## 1. Vision for Phase 4: Full-Scale Deployment and Collaboration

The goal of Phase 4 is to mature the application from a single-user or small-team tool into a robust, collaborative, and integrated platform. This phase focuses on features that support institutional adoption, long-term evaluation, and interoperability, transforming the platform into a true ecosystem for equitable urban planning.

The three core modules to be developed are:
1.  **Team Collaboration & Multi-Tenancy:** Allowing teams and organizations to work together securely.
2.  **Longitudinal Impact Tracking:** Supporting the framework's principle of "Perpetual Stewardship" by tracking project outcomes over time.
3.  **Public APIs:** Enabling integration with external systems to maximize systemic impact.

---

## 2. Module 1: Team Collaboration & Multi-Tenancy

This module introduces enterprise-level features for organizational use.

### 2.1. User Story & Workflow

1.  **An organization can have a workspace.** An "Admin" user can invite other users (e.g., planners, analysts) to become members of their organization.
2.  **Members of an organization can see and collaborate on all projects created within that organization's workspace.**
3.  **Role-Based Access Control (RBAC) is implemented.** For example:
    *   `Admin`: Can manage organization members and billing.
    *   `Editor`: Can create and edit projects, run analyses.
    *   `Viewer`: Can view projects and analysis results but cannot make changes.

### 2.2. Backend & Data Model Changes

*   **Create new Firestore collection: `organizations`**
    *   Each document will represent an organization and contain a `members` map, where keys are user UIDs and values are their roles (e.g., `{ "uid-123": "admin", "uid-456": "editor" }`).
*   **Modify `projects` collection:**
    *   Add an `organizationId` field to each project document, linking it to the `organizations` collection.
*   **Update Firestore Security Rules:**
    *   Implement rules that enforce organization-level access. A request to read or write a project document will only be allowed if the requesting user's UID is present in the `members` map of the project's parent `organization` document.

### 2.3. Frontend UI/UX Changes

*   **Create a new "Organization Settings" page:**
    *   Accessible only to admins, this page will have UI for inviting new members by email and managing the roles of existing members.
*   **Update the dashboard (`/dashboard`):**
    *   The main project query will be updated to fetch all projects where the `organizationId` matches the user's organization.
*   **Enhance project view:**
    *   Display avatars of other online collaborators in the project header.

---

## 3. Module 2: Longitudinal Impact Tracking

This module operationalizes the "Perpetual Stewardship" and evaluation principles of the framework.

### 3.1. User Story & Workflow

1.  **In a new "Impact Dashboard" section of a project, a user can define Key Performance Indicators (KPIs)** based on the initial DIIS analysis (e.g., "Reduce asthma rates in census tract X by 10%").
2.  **The UI provides a simple interface to manually input data points over time for each KPI** (e.g., entering the new asthma rate every year).
3.  **The dashboard displays simple charts (e.g., line charts) visualizing the progress of each KPI against its target.**
4.  **A "feedback loop" feature allows the user to trigger a new AI analysis,** feeding the real-world outcome data back into the AI to ask, "Based on the actual results, what should our next steps be?"

### 3.2. Backend & Data Model Changes

*   **Create new Firestore sub-collection: `kpis`**
    *   Nested under each project (`projects/{projectId}/kpis`), each document will represent a single KPI to track (e.g., `name: "Asthma Rates"`, `targetValue: 100`, `unit: "cases per 10,000"`).
*   **Create new Firestore sub-collection: `kpiDataPoints`**
    *   Nested under each KPI (`projects/{projectId}/kpis/{kpiId}/kpiDataPoints`), each document will be a single time-series data point (e.g., `timestamp: "2026-01-01"`, `value: 115`).

### 3.3. Frontend UI/UX Changes

*   **Create a new `ImpactDashboard.tsx` component:**
    *   This component will manage the creation and display of KPIs.
    *   It will use a charting library (like `recharts`, which is already in the project) to render the `kpiDataPoints` for each KPI.
    *   It will include a form to add new data points to a KPI.

---

## 4. Module 3: Public APIs

This module enables integration with other systems, turning the platform into a hub for urban data analysis.

### 4.1. Vision & Workflow

*   **The platform will expose a secure, RESTful API.** Authenticated users or systems can programmatically interact with their projects.
*   **Example Use Case 1 (Data Ingestion):** A municipality's open data portal could have a script that automatically creates a new project and uploads a new zoning plan PDF whenever one is published.
*   **Example Use Case 2 (Data Extraction):** A university research team could use the API to pull all validated qualitative insights from a project into their own statistical analysis software.

### 4.2. Backend & AI Flow Modifications

*   **This is a major backend task.** It would likely involve creating a new set of HTTP-triggered Cloud Functions.
*   **Each API endpoint would reuse the existing AI flows and Firestore logic.** For example, a `POST /api/v1/projects/{projectId}/analyze` endpoint would essentially call the same logic as the current file upload process.
*   **Authentication:** The API would use token-based authentication. Users could generate API keys from their account settings page.

### 4.3. Frontend UI/UX Changes

*   **Create a new "API Access" section in the user's account settings:**
    *   This UI would allow users to generate, view, and revoke API keys for their account.
    *   It would also link to comprehensive API documentation for developers.
