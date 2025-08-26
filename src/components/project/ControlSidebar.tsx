
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '@/components/project/FileUpload';
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
    <div className="absolute top-0 left-0 z-10 w-96 h-full bg-gray-900/80 backdrop-blur-sm overflow-y-auto text-white">
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

      <Accordion type="multiple" defaultValue={['item-1']} className="w-full text-white px-4">
        <AccordionItem value="item-1" className="border-gray-600">
          <AccordionTrigger className="hover:no-underline">Data Management</AccordionTrigger>
          <AccordionContent>
             <div className="space-y-4">
                <Card className="bg-gray-800/60 border-gray-700 text-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Project Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* DocumentList will go here */}
                         <div className="flex flex-col items-center justify-center text-center py-5 border-2 border-dashed border-gray-600 rounded-lg">
                            <p className="mt-2 text-sm text-gray-400">
                                No documents yet.
                            </p>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="bg-gray-800/60 border-gray-700 text-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Upload</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <FileUpload projectId={projectId} />
                    </CardContent>
                </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="border-gray-600">
          <AccordionTrigger className="hover:no-underline">Qualitative Analysis (HITL)</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-gray-600 rounded-lg">
                <h3 className="text-lg font-semibold">Pending Review</h3>
                <p className="mt-2 text-sm text-gray-400">
                    Upload a document to see AI-generated insights for review.
                </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className="border-b-0 border-gray-600">
          <AccordionTrigger className="hover:no-underline">Strategic Analysis</AccordionTrigger>
          <AccordionContent>
             <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-gray-600 rounded-lg">
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
