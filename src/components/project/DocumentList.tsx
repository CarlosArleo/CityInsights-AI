
'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Clock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import type { ProjectFile } from '@/lib/types';

interface DocumentListProps {
  files: ProjectFile[];
}

const FileStatusIcon = ({ status }: { status: ProjectFile['status'] }) => {
  switch (status) {
    case 'processing':
      return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    case 'failed':
      return <AlertTriangle className="h-4 w-4 text-red-400" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

export default function DocumentList({ files }: DocumentListProps) {
  
  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 bg-black/20 rounded-md">
        <p className="text-sm text-gray-400">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 bg-black/20 p-2 rounded-md">
      {files.map((file) => (
        <div key={file.id} className="flex items-center justify-between p-2 rounded-md hover:bg-white/5">
          <div className="flex items-center gap-3 overflow-hidden">
            <FileText className="h-4 w-4 text-gray-300 flex-shrink-0" />
            <span className="text-sm font-medium truncate" title={file.name}>{file.name}</span>
          </div>
          <FileStatusIcon status={file.status} />
        </div>
      ))}
    </div>
  );
}
