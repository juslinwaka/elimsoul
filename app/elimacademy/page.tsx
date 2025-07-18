'use client'
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import { useScreenConfig } from '@/hooks/screenConfig';
import { useToast } from '@/hooks/toast';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

// Import all interactive lessons
import MSLAlphabetLesson from '@/components/msl-comps/MslalphabetLesson';
import BasicConversationLesson from '@/components/msl-comps/BasicConversationLesson';
import NumbersLesson from '@/components/msl-comps/MSLNumbersLesson';
// import ColorsLesson from '@/components/msl-comps/ColorsLesson';
// import ShapesLesson from '@/components/msl-comps/ShapesLesson';
// import AnimalsLesson from '@/components/msl-comps/AnimalsLesson';
// import FoodLesson from '@/components/msl-comps/FoodLesson';
// import Weather&NatureLesson from '@/components/msl-comps/Weather&NatureLesson';

export default function Academy() {
  const { isMobile, isDesktop } = useScreenConfig();
  const [showFinalQuiz, setShowFinalQuiz] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<string>('');
  const [nextLessonId, setNextLessonId] = useState<string>('');
  const [lessonProgress, setLessonProgress] = useState<{ [key: string]: number }>({});
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const { showToast } = useToast();
  const user = auth.currentUser;
  const searchParams = useSearchParams();
  const lessonQuery = searchParams.get('lesson');

  const lessonData = [
    { title: 'MSL Alphabet', lessonId: 'alphabet' },
    { title: 'MSL Basic Conversation', lessonId: 'basic_convo' },
    { title: 'MSL Numbers', lessonId: 'numbersLesson' },
    // { title: 'MSL Colors', lessonId: 'colorsLesson' },
    // { title: 'MSL Shapes', lessonId: 'shapesLesson' },
    // { title: 'MSL Animals', lessonId: 'animalsLesson' },
    // { title: 'MSL Food', lessonId: 'foodLesson' },
    // { title: 'MSL Weather', lessonId: 'weatherLesson' },
    // Add more lessons here...
  ];

  const lessonComponents: { [key: string]: React.FC<any> } = {
    alphabet: MSLAlphabetLesson,
    basic_convo: BasicConversationLesson,
    numbersLesson: NumbersLesson,
    //colors: ColorsLesson,
    // Add more mappings here...
  };

  useEffect(() => {
    const fetchProgress = async () => {
      if (user) {
        const updatedProgress: { [key: string]: number } = {};
        await Promise.all(lessonData.map(async (lesson) => {
          const ref = doc(db, 'users', user.uid, 'progress', lesson.lessonId);
          const snap = await getDoc(ref);
          updatedProgress[lesson.lessonId] = snap.exists() ? snap.data().progress || 0 : 0;
        }));
        setLessonProgress(updatedProgress);
      }
    };
    fetchProgress();
  }, [user]);

  useEffect(() => {
    const syncStats = async () => {
      if (!user) return;
      const metaRef = doc(db, 'users', user.uid, 'meta', 'academyStats');
      const snap = await getDoc(metaRef);
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      if (snap.exists()) {
        const data = snap.data();
        const lastDate = data.lastLoginDate || today;
        setXp(data.xp || 0);
        let newStreak = 1;

        if (lastDate === today) {
          setStreak(data.streak || 1);
          return;
        }
        if (lastDate === yesterday) {
          newStreak = (data.streak || 1) + 1;
        }

        await setDoc(metaRef, {
          lastLoginDate: today,
          streak: newStreak,
        }, { merge: true });

        setStreak(newStreak);
        showToast(`🔥 You're on a ${newStreak}-day streak!`, 'info');
      } else {
        await setDoc(metaRef, {
          xp: 0,
          streak: 1,
          lastLoginDate: today,
        });
        setXp(0);
        setStreak(1);
        showToast('🔥 Your streak begins today!', 'info');
      }
    };
    syncStats();
  }, [user]);

  useEffect(() => {
    if (lessonQuery) {
      const current = lessonData.find((l) => l.lessonId === lessonQuery);
      const next = lessonData[lessonData.findIndex((l) => l.lessonId === lessonQuery) + 1];

      if (current) {
        setCurrentLesson(current.lessonId);
        setNextLessonId(next?.lessonId || '');
        setShowFinalQuiz(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [lessonQuery]);

  const handleFinalQuizCompletion = async (passed: boolean) => {
    if (passed && user && currentLesson) {
      const updated = { ...lessonProgress };

      const lessonRef = doc(db, 'users', user.uid, 'progress', currentLesson);
      await setDoc(lessonRef, { progress: 100 }, { merge: true });
      updated[currentLesson] = 100;

      if (nextLessonId) {
        const nextRef = doc(db, 'users', user.uid, 'progress', nextLessonId);
        await setDoc(nextRef, { progress: 10 }, { merge: true });
        updated[nextLessonId] = 10;

        showToast('🎉 Lesson complete! +20 XP earned.', 'success');
      }

      const metaRef = doc(db, 'users', user.uid, 'meta', 'academyStats');
      await setDoc(metaRef, {
        xp: increment(20),
        lastEarnedAt: Timestamp.now(),
      }, { merge: true });
      setXp((prev) => prev + 20);

      setLessonProgress({});
      setTimeout(() => {
        setLessonProgress(updated);
        setShowFinalQuiz(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const CurrentLessonComponent = currentLesson && lessonComponents[currentLesson];

  return (
    <Grid container spacing={2} justifyContent='center' alignItems='center'>
      <title>Academy Lab | ElimSoul</title>
      {isDesktop && (
        <Box>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Grid size={12} pt={6} justifyContent='center' justifyItems='center'>
        <Box sx={{ margin: 2, width: 1000, padding: 2, backgroundColor: 
          'rgba(02, 205, 255, 0.6)', borderRadius: 2, boxShadow: 3 }}>
          {CurrentLessonComponent && (
            <CurrentLessonComponent
              lessonId={currentLesson}
              nextLessonId={nextLessonId}
              onComplete={() => setShowFinalQuiz(true)}
            />
          )}
        </Box>

        {showFinalQuiz && (
          <div className="mt-6">
            <p className="text-center font-bold text-green-600">🎉 You've unlocked the next lesson!</p>
          </div>
        )}
      </Grid>

        </Box>
      )}
      {isMobile && (
        <Box>
          <Grid p={2}>
        <Box sx={{ margin: 2, width: 'auto', padding: 2, 
          backgroundColor: 'rgba(02, 205, 255, 0.6)', borderRadius: 2, boxShadow: 3 }}>
          {CurrentLessonComponent && (
            <CurrentLessonComponent
              lessonId={currentLesson}
              nextLessonId={nextLessonId}
              onComplete={() => setShowFinalQuiz(true)}
            />
          )}
        </Box>

        {showFinalQuiz && (
          <div className="mt-6">
            <p className="text-center font-bold text-green-600">🎉 You've unlocked the next lesson!</p>
          </div>
        )}
      </Grid>
        </Box>
      )}
 
    </Grid>
  );
}
