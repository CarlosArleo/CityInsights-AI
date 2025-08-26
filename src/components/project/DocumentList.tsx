
'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Clock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

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

const FileStatusIcon = ({ status }: { status: File['status'] }) => {
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

export default function DocumentList({ projectId }: DocumentListProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    setLoading(true);
    const filesQuery = query(
      collection(db, 'projects', projectId, 'files'),
      where('type', '!=', 'geojson'),
      orderBy('type'),
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
        <Skeleton className="h-8 w-full bg-gray-700/50" />
        <Skeleton className="h-8 w-full bg-gray-700/50" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <p className="text-sm text-gray-400 px-2 py-4 text-center">No documents uploaded.</p>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div key={file.id} className="flex items-center justify-between p-2 rounded-md bg-transparent hover:bg-white/5">
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-gray-300" />
            <span className="text-sm font-medium truncate">{file.name}</span>
          </div>
          <FileStatusIcon status={file.status} />
        </div>
      ))}
    </div>
  );
}
