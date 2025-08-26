
'use client';

import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { analyzeDocument } from '@/ai/flows/analyze-document';
import { processGeospatialData } from '@/ai/flows/process-geospatial-data';
import { useAuth } from '@/hooks/useAuth';

export default function FileUpload({ projectId }: { projectId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  const triggerAnalysis = async (fileId: string, fileContent: string, ownerId: string) => {
    try {
      await analyzeDocument({ projectId, fileId, fileContent, ownerId });
    } catch (error) {
      console.error('Failed to trigger analysis flow:', error);
       toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not start the AI analysis for the document.',
      });
    }
  };

  const triggerGeoJsonProcessing = async (fileId: string) => {
    try {
        await processGeospatialData({ projectId, fileId });
    } catch (error) {
        console.error('Failed to trigger GeoJSON processing flow:', error);
        toast({
            variant: 'destructive',
            title: 'Processing Failed',
            description: 'Could not start processing for the GeoJSON file.',
        });
    }
  };


  const handleUpload = async (file: File) => {
    if (!file || !projectId || !user) {
       toast({ variant: 'destructive', title: 'Authentication or Project Error' });
       return;
    }

    const allowedTextTypes = ['application/pdf', 'text/plain', 'text/markdown'];
    const isGeoJson = file.type === 'application/geo+json' || file.name.toLowerCase().endsWith('.geojson');

    if (!allowedTextTypes.includes(file.type) && !isGeoJson) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a .pdf, .txt, .md, or .geojson file.',
      });
      return;
    }
    
    setIsUploading(true);
    
    const toastId = toast({
        title: 'Uploading...',
        description: `Uploading "${file.name}".`,
    }).id;

    const storageRef = ref(storage, `users/${user.uid}/projects/${projectId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      () => {
        // Optional: update toast with progress here
      },
      (error) => {
        console.error('Upload failed:', error);
        toast({ id: toastId, variant: 'destructive', title: 'Upload Failed', description: error.message });
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const filesCollectionRef = collection(db, 'projects', projectId, 'files');
          
          const fileType = isGeoJson ? 'geojson' : 'document';

          const newFileDoc = await addDoc(filesCollectionRef, {
            name: file.name,
            url: downloadURL,
            storagePath: uploadTask.snapshot.ref.fullPath,
            type: fileType,
            status: 'uploaded',
            ownerId: user.uid, // Add ownerId to file document
            projectId: projectId,
            createdAt: serverTimestamp(),
          });

          toast({
            id: toastId,
            title: 'Upload Successful',
            description: `"${file.name}" is now being processed.`,
            action: <CheckCircle className="text-green-500" />,
          });

          if (fileType === 'document') {
             const reader = new FileReader();
             reader.onload = (e) => {
               const text = e.target?.result as string;
               triggerAnalysis(newFileDoc.id, text, user.uid);
             };
             reader.readAsText(file);
          } else if (fileType === 'geojson') {
            triggerGeoJsonProcessing(newFileDoc.id);
          }

        } catch (error) {
          console.error('Failed to update firestore', error);
          toast({
            id: toastId,
            variant: 'destructive',
            title: 'Database Update Failed',
            description: "File uploaded, but couldn't save its record.",
            action: <AlertCircle className="text-yellow-500" />,
          });
        } finally {
          setIsUploading(false);
        }
      }
    );
  };

  return (
    <div>
        <Button onClick={() => document.getElementById('file-input')?.click()} disabled={isUploading} className="w-full justify-start bg-primary hover:bg-primary/90 text-white font-semibold">
          <Plus className="mr-2 h-4 w-4" />
          Add Data
        </Button>
        <input
            type="file"
            id="file-input"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.txt,.md,.geojson,application/geo+json"
            disabled={isUploading}
        />
    </div>
  );
}
