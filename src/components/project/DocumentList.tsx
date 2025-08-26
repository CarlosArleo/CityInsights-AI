
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
    // Correctly query for documents of type 'document'
    const filesQuery = query(
      collection(db, 'projects', projectId, 'files'),
      where('type', '==', 'document'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(filesQuery, (querySnapshot) => {
      const filesData: File[] = [];
      querySnapshot.forEach((doc) => {
        filesData.push({ id: doc.id, ...doc.data() } as File);
      });
      setFiles(filesData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching documents:", error);
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
