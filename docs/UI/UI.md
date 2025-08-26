# Project Workspace: UI/UX Design Vision

The user interface and experience for the project workspace page are guided by a professional, modern design inspired by high-end data visualization tools like Kepler.gl.

## Core Design Principle

The core principle is a **full-screen, immersive map experience**. The map is not just a component on the page; it *is* the page. All other user interface elements are designed as floating "glass" panels that sit on top of the map, creating a sense of depth and keeping the user's focus on the spatial context of their data.

## Key Components and Layout

### 1. Full-Screen Map (`MapComponent.tsx`)

*   **Role**: This is the base layer and canvas for the entire user interface.
*   **Behavior**: It fills 100% of the browser's viewport.
*   **Style**: It uses a dark base map style (`mapbox://styles/mapbox/dark-v11`) to ensure a professional aesthetic and to provide high contrast for colorful data overlays, making them clearly visible.

### 2. Floating Control Sidebar (`ControlSidebar.tsx`)

*   **Role**: This is the primary control surface for all user interactions.
*   **Visuals**: It is a semi-transparent, "frosted glass" panel positioned on the left side of the screen. This is achieved with a `backdrop-blur` effect, which allows the map to remain subtly visible behind the controls, reinforcing the immersive feel and creating a modern look.
*   **Structure**: The content within the sidebar is meticulously organized using collapsible `Accordion` components. This design keeps the interface clean and prevents the user from being overwhelmed with options. The three primary sections are:
    1.  **Data Management**: Houses controls for uploading documents (PDF, TXT) and geospatial files (GeoJSON). It also contains the list of map layers that can be toggled on or off.
    2.  **Qualitative Analysis (HITL)**: This section is dedicated to the critical human-in-the-loop workflow. It displays the AI-generated insights as "review cards" for the user to validate, ensuring data quality.
    3.  **Strategic Analysis**: Provides access to the advanced Phase 3 tools, including the 'Shared Value Matrix' Simulator for comparing policy scenarios and the Content Generation & Synthesis Engine (CGSE) for creating reports.

### 3. Dynamic Interaction and User Experience

*   **Seamless Feedback Loop**: The user experience is designed to be highly interactive. For example, when a user checks a box next to a GeoJSON file in the "Data Management" accordion, that data layer is instantly rendered on the map.
*   **Focus on Synthesis**: This design allows a user to perform sophisticated socio-spatial synthesis. They can read a qualitative insight in the sidebar (e.g., "community concerns about lack of green space") and simultaneously toggle a map layer showing park locations to immediately see the spatial correlation.
*   **Professional & Efficient**: The overall aesthetic is clean, dark, and professional, suitable for a high-stakes analytical tool. The organization of tools into accordions creates an efficient workflow, allowing the user to focus on the task at hand, whether it's data ingestion, analysis, or strategic planning.
