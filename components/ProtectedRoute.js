'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      }else{
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);
  if (loading) {
    return <div>Loading...</div>;
  }
  return children;
};

export default ProtectedRoute;
