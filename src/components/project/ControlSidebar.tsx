
'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import QualitativeAnalysis from '@/components/project/QualitativeAnalysis';
import DataManagement from '@/components/project/DataManagement';
import StrategicAnalysis from './StrategicAnalysis';

interface Project {
  name: string;
}

interface ControlSidebarProps {
  projectId: string;
}

export default function ControlSidebar({ projectId }: ControlSidebarProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    const docRef = doc(db, 'projects', projectId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProject(docSnap.data() as Project);
      } else {
        console.log("No such document!");
        setProject(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [projectId]);


  return (
    <div className="absolute top-0 left-0 z-10 w-96 h-full bg-gray-900/80 backdrop-blur-sm overflow-y-auto text-white shadow-2xl">
      <div className="p-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4 bg-gray-700" />
            <Skeleton className="h-5 w-1/2 bg-gray-700" />
          </div>
        ) : project ? (
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-gray-300">Project Workspace</p>
          </div>
        ) : (
          <p>Project not found.</p>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['data-management', 'qualitative-analysis']} className="w-full text-white px-4">
        <AccordionItem value="data-management" className="border-gray-600">
          <AccordionTrigger className="hover:no-underline text-base font-semibold">Data Management</AccordionTrigger>
          <AccordionContent>
            <DataManagement projectId={projectId} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="qualitative-analysis" className="border-gray-600">
          <AccordionTrigger className="hover:no-underline text-base font-semibold">Qualitative Analysis (HITL)</AccordionTrigger>
          <AccordionContent>
            <QualitativeAnalysis projectId={projectId} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="strategic-analysis" className="border-b-0 border-gray-600">
          <AccordionTrigger className="hover:no-underline text-base font-semibold">Strategic Analysis</AccordionTrigger>
          <AccordionContent>
             <StrategicAnalysis />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
