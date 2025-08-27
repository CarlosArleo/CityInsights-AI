
'use client';

import FileUpload from '@/components/project/FileUpload';
import DocumentList from '@/components/project/DocumentList';
import GeospatialLayerList from './GeospatialLayerList';
import ReviewList from './ReviewList';
import StrategicAnalysis from './StrategicAnalysis';
import SidebarHeader from './SidebarHeader';
import { ScrollArea } from '../ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import type { Project, ProjectFile, ReviewCard } from '@/lib/types';


interface ControlSidebarProps {
  project: Project | null;
  files: ProjectFile[];
  reviews: ReviewCard[];
  activeLayers: string[];
  onLayerToggle: (fileId: string) => void;
  onUploadComplete: () => void;
}

export function ControlSidebar({ 
  project, 
  files, 
  reviews, 
  activeLayers, 
  onLayerToggle, 
  onUploadComplete 
}: ControlSidebarProps) {
  const geoJsonFiles = files.filter(f => f.type === 'geojson');
  const documentFiles = files.filter(f => f.type === 'document');

  return (
    <div 
      className="absolute top-0 left-0 z-10 w-[380px] h-screen flex flex-col bg-gray-900/10 backdrop-blur-md text-[var(--sidebar-foreground)] shadow-2xl"
    >
      <SidebarHeader project={project} loading={!project} />
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="multiple" defaultValue={['data', 'review']} className="w-full">
            <AccordionItem value="data">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">Data Management</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <FileUpload projectId={project?.id || ''} onUploadComplete={onUploadComplete} />
                <div>
                  <h3 className="font-semibold text-gray-300 mb-2">Documents</h3>
                  <DocumentList files={documentFiles} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-300 mb-2">Map Layers</h3>
                  <GeospatialLayerList 
                    files={geoJsonFiles} 
                    activeLayers={activeLayers}
                    onLayerToggle={onLayerToggle}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="review">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">Qualitative Analysis (HITL)</AccordionTrigger>
              <AccordionContent className="pt-4">
                <ReviewList reviews={reviews} />
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
