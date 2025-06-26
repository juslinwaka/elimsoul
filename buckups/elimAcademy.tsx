// ElimSoul Academy - MSL Lessons
'use client'

import Grid from '@mui/material/Grid';
import { Box, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import LessonCard from '@/components/msl-comps/LessonCard';
import MiniQuiz from '@/components/msl-comps/mini-quiz-checker';
import PDFLessonViewer from '@/components/msl-comps/PDFLessonViewer';
import { useScreenConfig } from '@/hooks/screenConfig';
import { useToast } from '@/hooks/toast';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import StreakBar from '@/components/msl-comps/streakXpSys';

export default function Academy() {
  const [pdfPath, setPdfPath] = useState('');
  const { isMobile, isDesktop } = useScreenConfig();
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFinalQuiz, setShowFinalQuiz] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<string>('');
  const [nextLessonId, setNextLessonId] = useState<string>('');
  const [lessonProgress, setLessonProgress] = useState<{ [key: string]: number }>({});
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const { showToast } = useToast();
  const user = auth.currentUser;

  const lessonData = [
    { title: 'MSL Alphabet', lessonId: 'alphabet', pdf: '/docs/Alphabets.pdf' },
    { title: 'MSL Basic Conversation', lessonId: 'basic_convo', pdf: '/docs/Basic Conversation.pdf' },
    { title: 'MSL Numbers', lessonId: 'numbers', pdf: '/docs/Numbers.pdf' },
    { title: 'MSL Colors', lessonId: 'colors', pdf: '/docs/Colors.pdf' },
    { title: 'MSL Education', lessonId: 'education', pdf: '/docs/Education.pdf' },
    { title: 'MSL Emotions', lessonId: 'emotions', pdf: '/docs/Emotions.pdf' },
    { title: 'MSL Family & People', lessonId: 'family_people', pdf: '/docs/Family And People.pdf' },
    { title: 'MSL Health', lessonId: 'health', pdf: '/docs/Health.pdf' },
    { title: 'MSL Professions', lessonId: 'professions', pdf: '/docs/Profession.pdf' },
    { title: 'MSL Places', lessonId: 'places', pdf: '/docs/Religion.pdf' },
    { title: 'MSL Religion', lessonId: 'religion', pdf: '/docs/Religion.pdf' },
    { title: 'MSL Time', lessonId: 'time', pdf: '/docs/Time.pdf' },
    { title: 'MSL Sport', lessonId: 'sport', pdf: '/docs/Sport.pdf' },
    { title: 'MSL Transportation', lessonId: 'transportation', pdf: '/docs/Transport.pdf' }
  ];

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

  const handleStartLesson = (lessonId: string, nextId: string) => {
    setCurrentLesson(lessonId);
    setNextLessonId(nextId);
    const selected = lessonData.find(lesson => lesson.lessonId === lessonId);
    setPdfPath(selected?.pdf || '');
    setShowQuiz(false);
    setShowFinalQuiz(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        setPdfPath('');
        setShowFinalQuiz(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <Grid container spacing={2} justifyContent='center' alignItems='center'>
      <title>Academy Lab | ElimSoul</title>

      <Grid size={12} pt={6}>
        <Box mt={2} textAlign="center">
          <Typography variant="h5" fontWeight="semibold" sx={{ color: 'white' }}>
            👋 Welcome to ElimSoul Academy – MSL Lessons 📚🤟
          </Typography>
          <Typography variant="body1" mt={1} sx={{ color: 'white' }}>
            Dive into the beautiful world of Malawian Sign Language 🌍. Learn to sign the alphabet 🔤, emotions 😊, professions 👩🏽‍🏫, nature 🌳, and more — one lesson at a time!
          </Typography>
        </Box>

        <StreakBar streak={streak} xp={xp} />

        <Box display='flex' flexWrap='wrap' justifyContent='center'>
          {lessonData.map((lesson, index) => (
            <LessonCard
              key={lesson.lessonId}
              title={lesson.title}
              lessonId={lesson.lessonId}
              previousLessonId={index === 0 ? undefined : lessonData[index - 1].lessonId}
              onClick={() => handleStartLesson(lesson.lessonId, lessonData[index + 1]?.lessonId || '')}
              progress={lessonProgress[lesson.lessonId] || 0}
            />
          ))}
        </Box>

        {pdfPath && (
          <Grid size={12} mt={4}>
            <PDFLessonViewer
              fileUrl={pdfPath}
              lessonId={currentLesson}
              onCompleteFinal={() => setShowFinalQuiz(true)}
            />
          </Grid>
        )}

        {showFinalQuiz && <MiniQuiz lessonId={currentLesson} nextLessonId={nextLessonId} onComplete={handleFinalQuizCompletion} />}
      </Grid>
    </Grid>
  );
}
