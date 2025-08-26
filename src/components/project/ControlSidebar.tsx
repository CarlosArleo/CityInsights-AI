
'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import FileUpload from '@/components/project/FileUpload';
import DocumentList from '@/components/project/DocumentList';
import GeospatialLayerList from './GeospatialLayerList';
import ReviewList from './ReviewList';
import StrategicAnalysis from './StrategicAnalysis';
import SidebarHeader from './SidebarHeader';
import { ScrollArea } from '../ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

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
    <div 
      className="absolute top-0 left-0 z-10 w-[350px] h-screen flex flex-col bg-gray-900/20 backdrop-blur-sm text-[var(--sidebar-foreground)] shadow-2xl"
    >
      <SidebarHeader project={project} loading={loading} />
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="multiple" defaultValue={['data', 'review']} className="w-full">
            <AccordionItem value="data">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">Data Management</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <FileUpload projectId={projectId} />
                <div>
                  <h3 className="font-semibold text-gray-300 mb-2">Documents</h3>
                  <DocumentList projectId={projectId} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-300 mb-2">Map Layers</h3>
                  <GeospatialLayerList projectId={projectId} />
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="review">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">Qualitative Analysis (HITL)</AccordionTrigger>
              <AccordionContent className="pt-4">
                <ReviewList projectId={projectId} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="analysis">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">Strategic Analysis</AccordionTrigger>
              <AccordionContent className="pt-4">
                <StrategicAnalysis />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
}
