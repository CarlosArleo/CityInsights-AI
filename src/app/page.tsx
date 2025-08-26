'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';
import { Loader2, Building2 } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Building2 className="h-12 w-12 text-primary" />
        <Loader2 className="mt-4 h-6 w-6 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Building2 className="h-10 w-10 text-primary" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">CityInsights AI</h1>
          <p className="mt-2 text-center text-muted-foreground">Democratic Masterplanning AI Platform</p>
        </div>
        <AuthForm />
      </div>
    </main>
  );
}
