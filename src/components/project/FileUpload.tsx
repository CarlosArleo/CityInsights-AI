
'use client';

import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { analyzeDocument } from '@/ai/flows/analyze-document';
import { processGeospatialData } from '@/ai/flows/process-geospatial-data';
import { useAuth } from '@/hooks/useAuth';

export default function FileUpload({ projectId }: { projectId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      const allowedTextTypes = ['application/pdf', 'text/plain', 'text/markdown'];
      const isGeoJson = selectedFile.type === 'application/geo+json' || selectedFile.name.toLowerCase().endsWith('.geojson');

      if (!allowedTextTypes.includes(selectedFile.type) && !isGeoJson) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a .pdf, .txt, .md, or .geojson file.',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const triggerAnalysis = async (fileId: string, fileContent: string) => {
    try {
      await analyzeDocument({ projectId, fileId, fileContent });
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


  const handleUpload = async () => {
    if (!file) {
      toast({ variant: 'destructive', title: 'No file selected' });
      return;
    }
    if (!projectId) {
       toast({ variant: 'destructive', title: 'Project ID is missing' });
      return;
    }
    if (!user) {
       toast({ variant: 'destructive', title: 'User not authenticated' });
       return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `users/${user.uid}/projects/${projectId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const allowedTextTypes = ['application/pdf', 'text/plain', 'text/markdown'];
    const isGeoJson = file.type === 'application/geo+json' || file.name.toLowerCase().endsWith('.geojson');

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const filesCollectionRef = collection(db, 'projects', projectId, 'files');
          
          const fileType = isGeoJson ? 'geojson' : file.type;

          const newFileDoc = await addDoc(filesCollectionRef, {
            name: file.name,
            url: downloadURL,
            storagePath: uploadTask.snapshot.ref.fullPath,
            type: fileType,
            status: 'uploaded',
            createdAt: serverTimestamp(),
            projectId: projectId,
          });

          toast({
            title: 'Upload Successful',
            description: `"${file.name}" has been uploaded and is now being processed.`,
            action: <CheckCircle className="text-green-500" />,
          });

          if (allowedTextTypes.includes(file.type)) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const text = e.target?.result as string;
              triggerAnalysis(newFileDoc.id, text);
            };
            reader.readAsText(file);
          } else if (isGeoJson) {
            triggerGeoJsonProcessing(newFileDoc.id);
          }

        } catch (error) {
          console.error('Failed to update firestore', error);
          toast({
            variant: 'destructive',
            title: 'Database Update Failed',
            description: "File uploaded, but couldn't save its record.",
            action: <AlertCircle className="text-yellow-500" />,
          });
        } finally {
          setIsUploading(false);
          setFile(null);
          setUploadProgress(0);
          // Clear the file input visually
          const fileInput = document.getElementById('file-upload') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        }
      }
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file-upload" className="text-sm font-medium text-gray-300">Choose a file</Label>
        <Input id="file-upload" type="file" onChange={handleFileChange} disabled={isUploading} accept=".pdf,.txt,.md,.geojson" className="text-white file:text-white" />
      </div>
      
      {isUploading && <Progress value={uploadProgress} className="w-full" />}
      
      <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full bg-primary hover:bg-primary/90 text-white">
        {isUploading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload File'}
      </Button>
    </div>
  );
}
