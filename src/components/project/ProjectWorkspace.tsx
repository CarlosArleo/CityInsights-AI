
'use client';

import ControlSidebar from '@/components/project/ControlSidebar';
import MapComponent from '@/components/project/MapComponent';

interface ProjectWorkspaceProps {
  projectId: string;
}

export default function ProjectWorkspace({ projectId }: ProjectWorkspaceProps) {
  return (
    <div className="relative h-screen w-screen bg-gray-900 overflow-hidden">
      <MapComponent />
      <ControlSidebar projectId={projectId} />
    </div>
  );
}
