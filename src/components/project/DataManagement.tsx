
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '@/components/project/FileUpload';
import DocumentList from '@/components/project/DocumentList';

interface DataManagementProps {
    projectId: string;
}

export default function DataManagement({ projectId }: DataManagementProps) {
    return (
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
    );
}
