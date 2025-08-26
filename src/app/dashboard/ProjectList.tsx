
'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CreateProjectDialog } from '@/components/dashboard/CreateProjectDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  createdAt: Timestamp;
  fileCount?: number;
}

export default function ProjectList() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const q = query(
      collection(db, 'projects'), 
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectsData: Project[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.createdAt) {
          projectsData.push({ id: doc.id, ...data } as Project);
        }
      });
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching projects: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return null;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Projects Dashboard</h1>
        <CreateProjectDialog userId={user.uid} />
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardFooter>
                 <Skeleton className="h-4 w-1/4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No Projects Yet</h2>
          <p className="mt-2 text-muted-foreground">Get started by creating your first project.</p>
          <div className="mt-6">
            <CreateProjectDialog userId={user.uid} />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link href={`/project/${project.id}`} key={project.id}>
              <Card className="hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
                <CardHeader className="flex-grow">
                  <CardTitle className="text-primary">{project.name}</CardTitle>
                  <CardDescription>
                    {project.createdAt ? `Created on ${project.createdAt.toDate().toLocaleDateString()}` : 'Date not available'}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>{project.fileCount || 0} documents</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
