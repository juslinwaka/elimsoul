'use client'
import Grid from '@mui/material/Grid';
import { Box, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import LessonCard from '@/components/msl-comps/LessonCard';
import MiniQuiz from '@/components/msl-comps/mini-quiz-checker';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import PDFLessonViewer from '@/components/msl-comps/PDFLessonViewer';
import { useScreenConfig } from '@/hooks/screenConfig';

export default function Academy() {
  const [pdfPath, setPdfPath] = useState('');
  const { isMobile, isDesktop } = useScreenConfig(); // Ensure correct detection of mobile/desktop
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<string>('lessonId1');
  const [nextLessonId, setNextLessonId] = useState<string>('lessonId2');
  const [lessonProgress, setLessonProgress] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1); // Track current page in PDF
  const [quizPassed, setQuizPassed] = useState<boolean>(false); // Track if quiz is passed
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
    // Fetch current lesson progress when component mounts
    const fetchProgress = async () => {
      if (user) {
        const lessonRef = doc(db, 'users', user.uid, 'progress', currentLesson);
        const lessonSnap = await getDoc(lessonRef);
        const lessonData = lessonSnap.exists() ? lessonSnap.data() : null;

        if (lessonData) {
          setLessonProgress(lessonData.progress || 0);
        } else {
          setLessonProgress(0); // If no progress data, start from 0
        }
      }
    };

    fetchProgress();
  }, [currentLesson, user]);

  const handleStartLesson = (lessonId: string, nextLessonId: string) => {
    setCurrentLesson(lessonId);
    setNextLessonId(nextLessonId);
    setPdfPath(lessonData.find(lesson => lesson.lessonId === lessonId)?.pdf || '');
    setPageNumber(1); // Reset page to 1
    setShowQuiz(false); // Hide quiz initially
  };

  const handleQuizCompletion = async (passed: boolean) => {
    if (passed && user) {
      // Update progress to 100% after quiz completion
      const lessonRef = doc(db, 'users', user.uid, 'progress', currentLesson);
      await setDoc(lessonRef, { progress: 100 });

      // Unlock next lesson
      const nextLessonRef = doc(db, 'users', user.uid, 'progress', nextLessonId);
      await setDoc(nextLessonRef, { progress: 10 }); // Unlock next lesson with progress
    }
    setShowQuiz(false); // Hide quiz after completion
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
    if (newPage === 5) { // Example: show quiz after the 5th page
      setShowQuiz(true);
    }
  };

  return (
    <Grid container spacing={2} justifyContent='center' alignItems='center'>
      <title>Academy Lab | ElimSoul</title>

      {/* Desktop view */}
      {isDesktop && (
        <Grid size={12} pt={6}>
          <Box mt={2} textAlign="center">
            <Typography variant="h5" fontWeight="semibold" sx={{ color: 'white' }}>
              👋 Welcome to ElimSoul Academy – MSL Lessons 📚🤟
            </Typography>
            <Typography variant="body1" mt={1} sx={{ color: 'white' }}>
              Dive into the beautiful world of Malawian Sign Language 🌍. Learn to sign the alphabet 🔤, emotions 😊, professions 👩🏽‍🏫, nature 🌳, and more — one lesson at a time!
            </Typography>
          </Box>

          <Box display='flex' flexWrap='wrap' justifyContent='center'>
            {lessonData.map((lesson, index) => (
              <LessonCard
                key={lesson.lessonId}
                title={lesson.title}
                lessonId={lesson.lessonId}
                previousLessonId={index === 0 ? undefined : lessonData[index - 1].lessonId}
                onClick={() => handleStartLesson(lesson.lessonId, lessonData[index + 1]?.lessonId || '')}
                progress={lessonProgress}
              />
            ))}
          </Box>

          {pdfPath && (
            <Grid size={12} mt={4}>
              <PDFLessonViewer
                fileUrl={pdfPath}
                lessonId={currentLesson}
                onPageChange={handlePageChange} // Track page changes
              />
            </Grid>
          )}

          {/* Display quiz after starting the lesson */}
          {showQuiz && (
            <MiniQuiz
              onComplete={handleQuizCompletion}
              lessonId={currentLesson}
              nextLessonId={nextLessonId}
            />
          )}
        </Grid>
      )}

      {/* Mobile view */}
      {isMobile && (
        <Grid size={12} pt={6}>
          <Box mt={2} textAlign="center">
            <Typography variant="h5" fontWeight="semibold" sx={{ color: 'white' }}>
              👋 Welcome to ElimSoul Academy – MSL Lessons 📚🤟
            </Typography>
            <Typography variant="body1" mt={1} sx={{ color: 'white' }}>
              Dive into the beautiful world of Malawian Sign Language 🌍. Learn to sign the alphabet 🔤, emotions 😊, professions 👩🏽‍🏫, nature 🌳, and more — one lesson at a time!
            </Typography>
          </Box>

          <Box display='flex' flexWrap='wrap' justifyContent='center'>
            {lessonData.map((lesson, index) => (
              <LessonCard
                key={lesson.lessonId}
                title={lesson.title}
                lessonId={lesson.lessonId}
                previousLessonId={index === 0 ? undefined : lessonData[index - 1].lessonId}
                onClick={() => handleStartLesson(lesson.lessonId, lessonData[index + 1]?.lessonId || '')}
                progress={lessonProgress}
              />
            ))}
          </Box>

          {pdfPath && (
            <Grid size={12} mt={4}>
              <PDFLessonViewer
                fileUrl={pdfPath}
                lessonId={currentLesson}
                onPageChange={handlePageChange} // Track page changes
              />
            </Grid>
          )}

          {/* Display quiz after starting the lesson */}
          {showQuiz && (
            <MiniQuiz
              onComplete={handleQuizCompletion}
              lessonId={currentLesson}
              nextLessonId={nextLessonId}
            />
          )}
        </Grid>
      )}
    </Grid>
  );
}
