import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/layout/Header';
import ProjectList from '@/components/dashboard/ProjectList';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Header />
        <main className="flex-1">
          <ProjectList />
        </main>
      </div>
    </ProtectedRoute>
  );
}
