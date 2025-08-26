
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '@/components/project/FileUpload';
import DocumentList from '@/components/project/DocumentList';
import QualitativeAnalysis from '@/components/project/QualitativeAnalysis';
import { Skeleton } from '@/components/ui/skeleton';

interface Project {
  name: string;
}

interface ControlSidebarProps {
  project: Project | null;
  projectId: string;
  loading: boolean;
}

export default function ControlSidebar({ project, projectId, loading }: ControlSidebarProps) {
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
             <div className="space-y-4">
                <Card className="bg-transparent border-gray-700 text-white">
                    <CardHeader className="p-4">
                        <CardTitle className="text-md">Upload New Data</CardTitle>
                         <CardDescription className="text-gray-400">Upload documents (.pdf, .txt) or geospatial data (.geojson).</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                       <FileUpload projectId={projectId} />
                    </CardContent>
                </Card>
                <Card className="bg-transparent border-gray-700 text-white">
                    <CardHeader className="p-4">
                        <CardTitle className="text-md">Project Files</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <DocumentList projectId={projectId} />
                    </CardContent>
                </Card>
            </div>
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
             <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-gray-600 rounded-lg bg-black/20">
                <h3 className="text-lg font-semibold">Analysis Tools</h3>
                <p className="mt-2 text-sm text-gray-400">
                    Tools for DIIS and Scenario Planning will be available here.
                </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
