# MVP User Stories

1.  **Authentication:** As an urban planner, I want to sign up and log in to the application securely using my email and password or my Google account, so that my project data is protected.

2.  **Project Dashboard:** As an urban planner, after logging in, I want to see a dashboard of all my projects and have a clear button to create a new project.

3.  **Project Creation:** As an urban planner, I want to be able to create a new project by giving it a name (e.g., "Downtown Revitalization Plan").

4.  **Document Upload:** As an urban planner, within a project, I want to upload relevant documents (PDFs, TXT files) for analysis.

5.  **AI Analysis (Backend):** As an urban planner, when I upload a document, I expect the system to automatically start analyzing it in the background using the concepts defined in `framework_principles.md`.

6.  **Review Interface (HITL):** As an urban planner, I want to see the results of the AI analysis presented as a list of individual "review cards." Each card should contain a specific text excerpt from a document and the AI's suggested tag (e.g., "Power Dynamics").

7.  **Curation:** As an urban planner, for each review card, I want to have three options: "Accept" the tag, "Reject" the tag, or "Modify" the tag (e.g., change it from "Power Dynamics" to "Perceptions").