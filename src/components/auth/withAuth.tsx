
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { LoaderCircle } from 'lucide-react';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>, allowedRoles?: string[]) => {
  const WithAuthComponent = (props: P) => {
    const { user, loading, userRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      } else if (!loading && user && allowedRoles && !allowedRoles.includes(userRole || '')) {
         router.push('/dashboard'); // Redirect to a generic page if role not allowed
      }
    }, [user, loading, userRole, router, allowedRoles]);

    if (loading || !user) {
      return (
        <div className="flex items-center justify-center h-screen">
          <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (allowedRoles && !allowedRoles.includes(userRole || '')) {
      return (
         <div className="flex items-center justify-center h-screen">
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      )
    }


    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithAuthComponent;
};

export default withAuth;
