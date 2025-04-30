'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticate, setIsAuthenticate] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsAuthenticate(true);
      }else{
        router.push('/')
      }
      setLoading(false);
    });
    return () => unsubscribe();

  }, [router]);

  if (loading) {
    return <div className='text-center p-4'>Loading...</div>;
  }
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
