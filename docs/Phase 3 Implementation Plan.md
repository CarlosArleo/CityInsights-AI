# Design Document: Phase 3 Implementation Plan

This document outlines the features and technical plan required to complete Phase 3 of the Democratic Masterplanning AI Platform, as described in the project's vision document (`AI for Democratic Urban Masterplanning.txt`).

## 1. Vision for Phase 3: From Insight to Action

The goal of Phase 3 is to bridge the gap between analysis and strategic action. With the analytical engines from Phase 1 and 2 complete, this phase focuses on building tools that help users make decisions, compare alternatives, and communicate their findings effectively.

The two core modules to be developed are:
1.  **The 'Shared Value Matrix' Simulator:** An interactive tool to model and compare the equity impacts of multiple policy scenarios.
2.  **The Content Generation & Synthesis Engine (CGSE):** An automation tool to generate structured reports and summaries from validated project data.

---

## 2. Module 1: The 'Shared Value Matrix' Simulator

This module upgrades the existing DIIS from a single-analysis tool to a comparative "war-gaming" engine.

### 2.1. User Story & Workflow

1.  **From the "Strategic Analysis" section, the user clicks a new "Run Scenario Simulation" button.** This opens a new, more advanced modal.
2.  **The modal displays two text areas side-by-side, labeled "Scenario A" and "Scenario B".** The user inputs two different policy texts (e.g., a market-rate vs. a mixed-income housing policy).
3.  **The user clicks "Compare Scenarios."** The backend runs an equity risk analysis on *both* scenarios simultaneously using the project's context.
4.  **The UI displays a comparative report.** This report shows the disparate impact analysis for each scenario side-by-side, along with a summary "Alignment Score" for key Shared Value Dimensions (e.g., Economic Justice, Social Equity).

### 2.2. Backend & AI Flow Modifications

*   **Create a new AI Flow: `src/ai/flows/scenario-simulation.ts`**
    *   **Input:** `projectId`, `scenarioAText`, `scenarioBText`.
    *   **Logic:**
        1.  Fetch the project context (accepted reviews, geojson layers) from Firestore, similar to the existing `analyzeEquityRisk` flow.
        2.  Call the `gemini-pro` model with a new, specialized prompt. This prompt will ask the AI to act as an evaluator, analyze both scenarios against the context, and score each scenario from 1-10 on predefined "Shared Value Dimensions" like `Economic Justice` and `Environmental Justice`.
    *   **Output:** A structured object containing the analysis for Scenario A, the analysis for Scenario B, and a list of `sharedValueScores` for each.
        ```typescript
        // Example Output Schema
        {
          scenarioA: { analysis: string, scores: [{ dimension: 'Economic Justice', score: 3 }, ...] },
          scenarioB: { analysis: string, scores: [{ dimension: 'Economic Justice', score: 8 }, ...] }
        }
        ```

### 2.3. Firestore Data Model Changes

*   **Create a new sub-collection: `scenarioAnalyses`**
    *   Within each `projects/{projectId}` document, create a new sub-collection named `scenarioAnalyses`.
    *   Each document in this collection will store the results of a single simulation run, containing the full input and output of the `scenarioSimulationFlow`. This preserves the history of simulations for a project.

### 2.4. Frontend UI/UX Changes

*   **Modify `src/components/project/StrategicAnalysis.tsx`:**
    *   Replace the "New DIIS Analysis" button with a new "Run Scenario Simulation" button.
    *   Create a new component, `ScenarioSimulationDialog`, to house the two-textarea input and the side-by-side results display. The results could be displayed in a two-column layout or using tabs within the dialog.

---

## 3. Module 2: The Content Generation & Synthesis Engine (CGSE)

This module automates the creation of high-stakes deliverables.

### 3.1. User Story & Workflow

1.  **From the "Strategic Analysis" section, the user clicks a new "Generate Report" button.**
2.  **A dialog appears asking the user to select a report type** (e.g., "Full Project Report," "Executive Summary," "Slide Deck Outline").
3.  **The user selects a type and clicks "Generate."**
4.  **A new AI flow runs in the background.** It gathers all curated data for the project: project description, all accepted qualitative insights, a summary of geospatial layers, and the results of any saved DIIS or Scenario analyses.
5.  **The AI synthesizes this information** into a well-structured narrative, formatted in Markdown, according to the selected report type.
6.  **The generated text is displayed in a modal,** with a button to "Copy to Clipboard" or "Download as .md".

### 3.2. Backend & AI Flow Modifications

*   **Create a new AI Flow: `src/ai/flows/generate-report.ts`**
    *   **Input:** `projectId`, `reportType` (enum: 'full', 'summary', 'deck').
    *   **Logic:**
        1.  This flow will perform the most comprehensive data gathering yet. It will query the `reviews` (for accepted insights), `files` (for geojson names), and `disparateImpactAnalyses` / `scenarioAnalyses` collections.
        2.  It will synthesize all this data into a single, large context string.
        3.  It will call the Gemini model with a detailed prompt tailored to the `reportType`, instructing it to structure the output with appropriate Markdown headings (e.g., `# 1. Introduction`, `## 2.1 Key Qualitative Themes`).
    *   **Output:** A single string containing the full, formatted Markdown report.

### 3.3. Firestore Data Model Changes

*   No new collections are needed. This flow will be a read-only synthesizer of existing project data.

### 3.4. Frontend UI/UX Changes

*   **Modify `src/components/project/StrategicAnalysis.tsx`:**
    *   Add a new "Generate Report" button.
    *   Create a new component, `ReportGenerationDialog`, to handle the report type selection and display the final generated Markdown content. This could use a simple `<textarea>` or a more advanced Markdown renderer for display.
