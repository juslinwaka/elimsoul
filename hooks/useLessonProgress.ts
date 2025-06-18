// hooks/useLessonProgress.ts
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase'; // your firebase config file
import { doc, getDoc } from 'firebase/firestore';

export function useLessonProgress(userId: string, lessonId: string) {
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      const docRef = doc(db, 'users', userId, 'progress', lessonId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProgress(docSnap.data().progress || 0);
      } else {
        setProgress(0);
      }
      setLoading(false);
    };

    fetchProgress();
  }, [userId, lessonId]);

  return { progress, isLoading };
}
