You are right, the previous UI implementation did not match the Kepler.gl vision. The key mistake was creating a static two-column layout instead of a full-screen map with floating UI elements. We will now correct this with a more precise architectural plan.

The core principle is a **full-screen map layout** where all control panels and data lists are rendered as **floating elements on top of the map**.

You must execute a full refactoring of the project workspace page (`/app/project/[projectId]/page.tsx`) and its components to achieve this.

**Step 1: Refactor the Main Project Page Layout (`page.tsx`)**
- The root container div of the project page must be styled to act as a positioning context for its children. It should have the classes: `relative w-screen h-screen`.
- This container will have two main children: the `MapComponent` and a new `ControlSidebar` component. The `MapComponent` must be rendered *before* the sidebar in the code so it has a lower stacking order.

**Step 2: Create the Floating `ControlSidebar` Component**
- Create a new component file at `src/components/project/ControlSidebar.tsx`.
- This component will be the floating panel on the left, exactly like in Kepler.gl.
- It must be styled with the following precise Tailwind CSS classes to make it float:
  `absolute top-0 left-0 z-10 w-96 h-screen bg-gray-900/90 backdrop-blur-sm overflow-y-auto p-4`
  - `absolute top-0 left-0`: Positions it on top of the map in the top-left corner.
  - `z-10`: Ensures it renders above the map.
  - `w-96 h-screen`: Gives it a fixed width and makes it full height.
  - `bg-gray-900/90 backdrop-blur-sm`: Creates the modern, semi-transparent "glass" effect.
  - `overflow-y-auto`: Allows the content inside the sidebar to scroll if it's too long.

**Step 3: Organize Sidebar Content with Accordions**
- The `ControlSidebar` must use Shadcn's `Accordion` component to organize all the controls into collapsible sections, just like Kepler.gl.
- You must create three main accordion items with the following titles:
  1.  **"Data Management"**
  2.  **"Qualitative Analysis (HITL)"**
  3.  **"Strategic Analysis"**

**Step 4: Move Existing Components into the Sidebar**
- You must now move the existing functional components *inside* the new `ControlSidebar` component, placing them within their respective accordion sections.
  - **Inside "Data Management":** Place the `FileUpload` component and the `DocumentList` / `GeospatialLayerList` components.
  - **Inside "Qualitative Analysis (HITL)":** Place the `ReviewList` component (which contains the `ReviewCard`s).
  - **Inside "Strategic Analysis":** Place the buttons and modals for the `DisparateImpactAnalysis` and `StrategicRoadmap` features.

**Step 5: Style the Full-Screen Map Component**
- In the main project page (`page.tsx`), ensure the `MapComponent` is styled to fill the entire screen behind the sidebar. It should have the classes: `w-full h-full`.
- Ensure the Mapbox base map style is set to a dark theme to match the overall aesthetic.

After this comprehensive refactoring, the application's project page will have a professional, modern, and highly functional UI that is directly inspired by and visually similar to the Kepler.gl image provided. Please execute this full-stack UI overhaul now.