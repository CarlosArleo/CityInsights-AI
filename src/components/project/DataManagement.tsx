
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '@/components/project/FileUpload';
import DocumentList from '@/components/project/DocumentList';
import GeospatialLayerList from './GeospatialLayerList';
import { Separator } from '../ui/separator';

interface DataManagementProps {
    projectId: string;
}

export default function DataManagement({ projectId }: DataManagementProps) {
    return (
        <div className="space-y-4">
            <Card className="bg-transparent border-gray-700 text-white">
                <CardHeader className="p-4">
                    <CardTitle className="text-md">Upload New Data</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <FileUpload projectId={projectId} />
                </CardContent>
            </Card>
            
            <Card className="bg-transparent border-gray-700 text-white">
                <CardHeader className="p-4">
                    <CardTitle className="text-md">Project Documents</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <DocumentList projectId={projectId} />
                </CardContent>
            </Card>

            <Card className="bg-transparent border-gray-700 text-white">
                <CardHeader className="p-4">
                    <CardTitle className="text-md">Geospatial Layers</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <GeospatialLayerList projectId={projectId} />
                </CardContent>
            </Card>
        </div>
    );
}
