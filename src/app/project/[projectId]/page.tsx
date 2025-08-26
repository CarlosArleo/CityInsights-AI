'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/layout/Header';
import FileUpload from '@/components/project/FileUpload';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Project {
  name: string;
  files?: { name: string; url: string; uploadedAt: string }[];
}

interface ProjectPageParams {
  params: {
    projectId: string;
  };
}

export default function ProjectPage({ params }: ProjectPageParams) {
  const { projectId } = params;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    const docRef = doc(db, 'projects', projectId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            setProject(docSnap.data() as Project);
        } else {
            console.log("No such document!");
            setProject(null);
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, [projectId]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Header />
        <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-5 w-1/3" />
            </div>
          ) : project ? (
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">{project.name}</h1>
              <p className="text-muted-foreground mt-1">Project Analysis & Curation</p>
            </div>
          ) : (
             <p>Project not found.</p>
          )}

          <Separator className="my-6" />

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Documents</CardTitle>
                  <CardDescription>
                    Upload .pdf, .txt, and .md files for analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload projectId={projectId} />
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
                <Card className="min-h-[400px]">
                    <CardHeader>
                        <CardTitle>Analysis Results</CardTitle>
                        <CardDescription>
                            Review excerpts and tags identified by the AI.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="flex flex-col items-center justify-center text-center py-10 border-2 border-dashed rounded-lg">
                            <h3 className="text-lg font-semibold">Ready for Analysis</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Upload a document to begin the AI-powered analysis process.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
