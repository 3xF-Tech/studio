
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';

type Role = 'admin' | 'secretary' | 'professional' | 'finance' | 'marketing' | 'readonly';

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles?: Role[]
) => {
  const AuthComponent = (props: P) => {
    const { user, userRole, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (loading) {
        return; // Wait for the auth state to be determined
      }

      if (!user) {
        router.replace('/login');
        return;
      }

      // If allowedRoles are specified and the user's role is not in the list, redirect
      if (allowedRoles && userRole && !allowedRoles.includes(userRole as Role)) {
        router.replace('/dashboard'); // Redirect to a safe page
      }
    }, [user, userRole, loading, router]);

    // Show a loading state while we verify authentication
    if (loading || !user || (allowedRoles && !userRole)) {
      return (
         <div className="p-4 space-y-4">
            <Skeleton className="h-12 w-1/4" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
             <Skeleton className="h-96" />
        </div>
      );
    }
    
    // If user is authenticated and has the correct role, render the component
    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return AuthComponent;
};

export default withAuth;
