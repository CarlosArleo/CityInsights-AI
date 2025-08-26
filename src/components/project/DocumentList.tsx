
'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Map, Clock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface File {
  id: string;
  name: string;
  type: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  createdAt: Timestamp;
}

interface DocumentListProps {
  projectId: string;
}

const FileStatus = ({ status }: { status: File['status'] }) => {
  switch (status) {
    case 'processing':
      return <Badge variant="secondary"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Processing</Badge>;
    case 'completed':
      return <Badge className="bg-green-600"><CheckCircle className="mr-1 h-3 w-3" />Completed</Badge>;
    case 'failed':
      return <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" />Failed</Badge>;
    default:
      return <Badge variant="outline"><Clock className="mr-1 h-3 w-3" />Uploaded</Badge>;
  }
};

export default function DocumentList({ projectId }: DocumentListProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    setLoading(true);
    const filesQuery = query(
      collection(db, 'projects', projectId, 'files'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(filesQuery, (querySnapshot) => {
      const filesData: File[] = [];
      querySnapshot.forEach((doc) => {
        filesData.push({ id: doc.id, ...doc.data() } as File);
      });
      setFiles(filesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [projectId]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full bg-gray-700" />
        <Skeleton className="h-10 w-full bg-gray-700" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-5 border-2 border-dashed border-gray-600 rounded-lg">
        <p className="mt-2 text-sm text-gray-400">No documents yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div key={file.id} className="flex items-center justify-between p-2 rounded-md bg-black/20">
          <div className="flex items-center gap-3">
            {file.type.includes('geojson') ? <Map className="h-5 w-5 text-accent" /> : <FileText className="h-5 w-5 text-primary-foreground" />}
            <span className="text-sm font-medium truncate">{file.name}</span>
          </div>
          <FileStatus status={file.status} />
        </div>
      ))}
    </div>
  );
}
