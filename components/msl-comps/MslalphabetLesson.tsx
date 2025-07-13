'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useToast } from '@/hooks/toast';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, increment } from 'firebase/firestore';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import alphabetData from '@/data/msl_alphabet_data.json';

interface MSLAlphabetLessonProps {
  lessonId: string;
  nextLessonId?: string;
  onComplete: () => void;
}

export default function MSLAlphabetLesson({ lessonId, nextLessonId, onComplete }: MSLAlphabetLessonProps) {
  const [currentStep, setCurrentStep] = useState<'learn' | 'quiz'>('learn');
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const { showToast } = useToast();
  const user = auth.currentUser;

  interface AlphabetItem {
    letter: string;
    image: string;
  }

  const handleAnswer = (selected: string): void => {
    const correct: string = (alphabetData as AlphabetItem[])[quizIndex].letter;
    if (selected === correct) {
      setScore(score + 1);
      showToast('✅ Correct!', 'success');
    } else {
      showToast(`❌ Oops! It's ${correct}`, 'error');
    }

    if (quizIndex + 1 < (alphabetData as AlphabetItem[]).length) {
      setQuizIndex(quizIndex + 1);
    } else {
      handleCompletion();
    }
  };

  const handleCompletion = async () => {
    showToast('🎉 Quiz Complete! +20 XP', 'success');
    if (user) {
      const lessonRef = doc(db, 'users', user.uid, 'progress', lessonId);
      await setDoc(lessonRef, { progress: 100 }, { merge: true });
      if (nextLessonId) {
        const nextRef = doc(db, 'users', user.uid, 'progress', nextLessonId);
        await setDoc(nextRef, { progress: 10 }, { merge: true });
      }
      const metaRef = doc(db, 'users', user.uid, 'meta', 'academyStats');
      await setDoc(metaRef, {
        xp: increment(20),
        lastEarnedAt: new Date()
      }, { merge: true });
    }
    onComplete();
  };

  return (
    <Box sx={{ p: 4 }} justifyContent='center' justifySelf='center'>
      <Typography variant="h4" align="center" sx={{color: 'white'}} fontWeight={700} gutterBottom>
        MSL Alphabet Lesson
      </Typography>
      <Typography align="center" sx={{color: 'white'}} fontWeight={500} gutterBottom>
        Welcome to Elimsoul Certificate of Basic education 1st Term lessons, This week you're going to learn the MSL Alphabet.
        The resources provided in this lessons are designed to help you understand the basics of MSL Alphabet based on the Malawian Sign Language. The lesson resources were extracted from the MANAD MSLD
      </Typography>

      {currentStep === 'learn' && (
        <Grid container spacing={2} justifyContent="center">
          {alphabetData.map(({ letter, image }) => (
            <Grid size={6} key={letter}>
              <Card elevation={3} sx={{ borderRadius: 3, p: 1 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography sx={{color: 'white'}} variant="h6" gutterBottom>
                    {letter}
                  </Typography>
                  <Image
                    src={image}
                    alt={`Sign for ${letter}`}
                    width={100}
                    height={100}
                    style={{ borderRadius: 8 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {currentStep === 'quiz' && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" gutterBottom>
            What letter is this sign?
          </Typography>
          <Image
            src={alphabetData[quizIndex].image}
            alt="Quiz Sign"
            width={200}
            height={200}
            style={{ borderRadius: 12, marginBottom: 16 }}
          />
          <Grid container spacing={2} justifyContent="center">
            {[...Array(3)].map((_, i) => {
              const optionIndex = (quizIndex + i) % alphabetData.length;
              return (
                <Grid  key={i}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleAnswer(alphabetData[optionIndex].letter)}
                  >
                    {alphabetData[optionIndex].letter}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {currentStep === 'learn' && (
        <Box textAlign="center" mt={4}>
          <Button variant="contained" color="primary" size="large" onClick={() => setCurrentStep('quiz')}>
            Start Quiz
          </Button>
        </Box>
      )}
    </Box>
  );
}
