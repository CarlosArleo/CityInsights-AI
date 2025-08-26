
'use client';

import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function FileUpload({ projectId }: { projectId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
       const allowedTypes = ['application/pdf', 'text/plain', 'text/markdown', 'application/json'];
      
      // A simple check for geojson file extension
      const isGeoJson = selectedFile.name.toLowerCase().endsWith('.geojson');

      if (!allowedTypes.includes(selectedFile.type) && !isGeoJson) {
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

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a file to upload.',
      });
      return;
    }
    if (!projectId) {
      toast({
        variant: 'destructive',
        title: 'Project ID is missing',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `projects/${projectId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: error.message,
        });
        setIsUploading(false);
      },
      async () => {
        try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const projectDocRef = doc(db, 'projects', projectId);
            
            const isGeoJson = file.name.toLowerCase().endsWith('.geojson');
            const fileType = isGeoJson ? 'geojson' : file.type;

            await updateDoc(projectDocRef, {
                files: arrayUnion({
                    name: file.name,
                    url: downloadURL,
                    type: fileType,
                    status: 'uploaded',
                    uploadedAt: new Date().toISOString(),
                }),
                fileCount: increment(1)
            });

            toast({
              title: 'Upload Successful',
              description: `"${file.name}" has been uploaded.`,
              action: <CheckCircle className="text-green-500" />,
            });
        } catch (error) {
            console.error('Failed to update firestore', error);
             toast({
              variant: 'destructive',
              title: 'Database Update Failed',
              description: "File uploaded, but couldn't save reference.",
              action: <AlertCircle className="text-yellow-500" />,
            });
        } finally {
            setIsUploading(false);
            setFile(null);
            setUploadProgress(0);
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
