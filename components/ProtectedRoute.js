'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/toast';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const {showToast} = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticate(true);
      }else{
        showToast("signed out successfully.", "success");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div className='text-center p-4'>Loading...</div>;
  }
  return isAuthenticate ? children : null;
};

export default ProtectedRoute;
