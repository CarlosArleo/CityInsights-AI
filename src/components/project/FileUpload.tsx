
'use client';

import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, CheckCircle, AlertCircle } from 'lucide-react';
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
    
    const toastRef = toast({
        title: 'Uploading...',
        description: `Uploading "${file.name}".`,
    });

    const storageRef = ref(storage, `users/${user.uid}/projects/${projectId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      () => {
        // Optional: update toast with progress here
      },
      (error: any) => {
        console.error('Upload failed:', error);
        toastRef.update({ id: toastRef.id, variant: 'destructive', title: 'Upload Failed', description: error.message });
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const filesCollectionRef = collection(db, 'projects', projectId, 'files');
          
          const fileType = isGeoJson ? 'geojson' : 'document';

          // The Cloud Function (trigger) will listen for the creation of this document.
          await addDoc(filesCollectionRef, {
            name: file.name,
            url: downloadURL,
            storagePath: uploadTask.snapshot.ref.fullPath,
            type: fileType,
            status: 'uploaded', // The trigger will change this to 'processing'
            ownerId: user.uid,
            projectId: projectId,
            createdAt: serverTimestamp(),
          });

          toastRef.update({
            id: toastRef.id,
            title: 'Upload Successful',
            description: `"${file.name}" has been queued for analysis.`,
            action: <CheckCircle className="text-green-500" />,
          });

        } catch (error: any) {
          console.error('Failed to create file metadata in Firestore', error);
          toastRef.update({
            id: toastRef.id,
            variant: 'destructive',
            title: 'Database Update Failed',
            description: "File uploaded, but couldn't save its metadata record.",
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
