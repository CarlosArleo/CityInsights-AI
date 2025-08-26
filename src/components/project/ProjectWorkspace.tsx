
'use client';

import { useParams } from 'next/navigation';
import ControlSidebar from '@/components/project/ControlSidebar';
import MapComponent from '@/components/project/MapComponent';

export default function ProjectWorkspace() {
  const { projectId } = useParams() as { projectId: string };

  return (
    <div className="relative h-screen w-screen bg-gray-900 overflow-hidden">
      <MapComponent />
      <ControlSidebar projectId={projectId} />
    </div>
  );
}
