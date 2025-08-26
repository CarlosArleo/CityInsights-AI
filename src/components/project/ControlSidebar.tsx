
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/hooks/useAuth';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import QualitativeAnalysis from '@/components/project/QualitativeAnalysis';
import DataManagement from '@/components/project/DataManagement';
import StrategicAnalysis from './StrategicAnalysis';
import { Building2, LogOut, User as UserIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

interface Project {
  name: string;
}

interface ControlSidebarProps {
  projectId: string;
}

const SidebarHeader = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
     <div className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-900/50">
        <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-primary-foreground transition-colors">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-sm">CityInsights AI</span>
        </Link>
        {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                      <AvatarFallback>
                        {user.email ? user.email.charAt(0).toUpperCase() : <UserIcon size={16} />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName ?? 'Planner'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
        )}
    </div>
  );
};


export default function ControlSidebar({ projectId }: ControlSidebarProps) {
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
    <div className="absolute top-0 left-0 z-10 w-96 h-screen flex flex-col bg-gray-900/80 backdrop-blur-sm text-white shadow-2xl">
      <SidebarHeader />
      <div className="p-4 border-b border-gray-700">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4 bg-gray-700" />
            <Skeleton className="h-5 w-1/2 bg-gray-700" />
          </div>
        ) : project ? (
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-gray-300">Project Workspace</p>
          </div>
        ) : (
          <p>Project not found.</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <Accordion type="multiple" defaultValue={['data-management', 'qualitative-analysis']} className="w-full text-white px-4">
          <AccordionItem value="data-management" className="border-gray-600">
            <AccordionTrigger className="hover:no-underline text-base font-semibold">Data Management</AccordionTrigger>
            <AccordionContent>
              <DataManagement projectId={projectId} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="qualitative-analysis" className="border-gray-600">
            <AccordionTrigger className="hover:no-underline text-base font-semibold">Qualitative Analysis (HITL)</AccordionTrigger>
            <AccordionContent>
              <QualitativeAnalysis projectId={projectId} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="strategic-analysis" className="border-b-0 border-gray-600">
            <AccordionTrigger className="hover:no-underline text-base font-semibold">Strategic Analysis</AccordionTrigger>
            <AccordionContent>
               <StrategicAnalysis />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
