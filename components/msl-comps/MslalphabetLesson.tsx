// (File top remains unchanged...)
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/toast';
import { db, auth } from '@/lib/firebase';
import {
  doc, getDoc, setDoc, increment, collection, addDoc, Timestamp
} from 'firebase/firestore';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import { Slide } from 'react-awesome-reveal';
import useSound from 'use-sound';
import ReactHowler from 'react-howler';
import { useRouter } from 'next/navigation';

import alphabetData from '@/data/msl_alphabet_data.json';

interface MSLAlphabetLessonProps {
  lessonId: string;
  nextLessonId?: string;
  onComplete: () => void;
}

const batchSize = 10;

export default function MSLAlphabetLesson({ lessonId, nextLessonId, onComplete }: MSLAlphabetLessonProps) {
  const [currentStep, setCurrentStep] = useState<'learn' | 'quiz'>('learn');
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [inputAnswer, setInputAnswer] = useState('');
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [assignmentCreated, setAssignmentCreated] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [failedIndices, setFailedIndices] = useState<number[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [bgPlaying, setBgPlaying] = useState(true);
  const { showToast } = useToast();
  const user = auth.currentUser;
  const router = useRouter();
  const [assignmentId, setAssignmentId] = useState('');
  const [countdown, setCountdown] = useState(5);

  const [playCorrect] = useSound('/sounds/correct.mp3');
  const [playWrong] = useSound('/sounds/wrong.mp3');

  const generateCombinationIndices = () => {
    const result: number[][] = [];
    for (let i = 0; i < alphabetData.length; i += 5) {
      const batch = alphabetData.slice(i, i + 5);
      for (let a = 0; a < batch.length; a++) {
        for (let b = 0; b < batch.length; b++) {
          result.push([i + a, i + b]);
        }
      }
    }
    return result;
  };

  const combinationIndices = generateCombinationIndices();
  const totalLessons = alphabetData.length + combinationIndices.length;

  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        const ref = doc(db, 'users', user.uid, 'progress', lessonId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data.progressIndex !== undefined) {
            setQuizIndex(data.progressIndex);
          }
        }
      }
    };
    loadProgress();
  }, [user]);

  useEffect(() => {
    if (assignmentId && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (assignmentId && countdown === 0) {
      router.push(`/assignmentView/${assignmentId}`);
    }
  }, [assignmentId, countdown]);

  const createAssignment = async () => {
    if (!user || assignmentCreated) return;
    const dueDate = Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    const assignment = {
      title: 'Sign the Alphabet + 10 Words',
      description: 'Submit a video signing all 26 MSL alphabet signs and 10 signed words.',
      status: 'pending',
      createdAt: Timestamp.now(),
      dueAt: dueDate,
      lessonRef: lessonId,
    };
    const docRef = await addDoc(collection(db, 'students', user.uid, 'assignments'), assignment);
    setAssignmentId(docRef.id);
    setAssignmentCreated(true);
    showToast('📘 Assignment posted to your blackboard! Redirecting in 5s…', 'success');
  };

  const saveProgress = async () => {
    if (user) {
      const percent = Math.min(100, Math.floor(((quizIndex + 1) / totalLessons) * 100));
      const lessonRef = doc(db, 'users', user.uid, 'progress', lessonId);
      await setDoc(lessonRef, { progress: percent, progressIndex: quizIndex }, { merge: true });

      const metaRef = doc(db, 'users', user.uid, 'meta', 'academyStats');
      await setDoc(metaRef, {
        xp: increment(15),
        lastEarnedAt: new Date()
      }, { merge: true });
    }
  };

  const handleChoiceAnswer = (selected: string) => {
    const correct = alphabetData[quizIndex % alphabetData.length].letter;
    if (selected === correct) {
      playCorrect();
      showToast('✅ Correct!', 'success');
      nextQuiz();
    } else {
      playWrong();
      if (attempts < 1) {
        setAttempts(attempts + 1);
        showToast('🔁 Try again', 'warning');
      } else {
        showToast(`❌ It's ${correct}`, 'error');
        setFailedIndices([...failedIndices, quizIndex]);
        nextQuiz();
      }
    }
  };

  const handleInputAnswer = () => {
    const comboIndex = quizIndex - alphabetData.length;
    const [firstIdx, secondIdx] = combinationIndices[comboIndex];
    const word = `${alphabetData[firstIdx].letter}${alphabetData[secondIdx].letter}`.toLowerCase();

    if (inputAnswer.trim().toLowerCase() === word) {
      playCorrect();
      showToast('✅ Correct!', 'success');
      nextQuiz();
    } else {
      playWrong();
      if (attempts < 1) {
        setAttempts(attempts + 1);
        showToast('🔁 Try again', 'warning');
      } else {
        showToast(`❌ It was "${word}"`, 'error');
        setFailedIndices([...failedIndices, quizIndex]);
        nextQuiz();
      }
    }
  };

  const nextQuiz = () => {
    setAttempts(0);
    const nextIndex = quizIndex + 1;
    if (nextIndex % batchSize === 0 && !isReviewMode) {
      setShowContinuePrompt(true);
      saveProgress();
    } else if (nextIndex >= alphabetData.length && !isReviewMode && failedIndices.length > 0) {
      setQuizIndex(failedIndices[0]);
      setFailedIndices(failedIndices.slice(1));
      setIsReviewMode(true);
    } else if (nextIndex >= totalLessons) {
      setShowCertificate(true);
      createAssignment();
    } else {
      setQuizIndex(nextIndex);
      setInputAnswer('');
    }
  };

  const handleContinue = () => {
    setShowContinuePrompt(false);
    setQuizIndex(quizIndex + 1);
    setInputAnswer('');
  };

  // ✨ Milestone buttons: always visible, only unlocked are enabled
  const renderMilestoneButtons = () => {
    const totalMilestones = Math.ceil((alphabetData.length + combinationIndices.length) / batchSize);
    const currentMilestone = Math.floor(quizIndex / batchSize) + 1;
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6" color="secondary">📚 Milestones</Typography>
        <Grid container spacing={1} justifyContent="center" mt={1}>
          {[...Array(totalMilestones)].map((_, i) => {
            const milestoneNum = i + 1;
            // Enable if milestoneNum <= currentMilestone
            const isEnabled = milestoneNum <= currentMilestone;
            return (
              <Grid key={milestoneNum}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{color: 'white'}}
                  disabled={!isEnabled}
                  onClick={() => {
                    if (isEnabled) {
                      setQuizIndex(i * batchSize);
                      setCurrentStep('quiz');
                    }
                  }}
                >
                  Milestone {milestoneNum}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  const renderQuizMode = () => {
    if (quizIndex < alphabetData.length) {
      const index = quizIndex;
      const options = [
        alphabetData[index],
        alphabetData[(index + 1) % alphabetData.length],
        alphabetData[(index + 2) % alphabetData.length]
      ].sort(() => Math.random() - 0.5);

      return (
        <Slide direction="up">
          <Box textAlign="center" mt={4}>
            <Typography variant="h6" gutterBottom>Match Sign {quizIndex + 1}</Typography>
            <Image src={alphabetData[index].image} alt="Quiz Sign" width={200} height={200} style={{ borderRadius: 12, marginBottom: 16 }} />
            <Grid container spacing={2} justifyContent="center">
              {options.map((opt, i) => (
                <Grid key={i}>
                  <Button variant="contained" color="secondary" onClick={() => handleChoiceAnswer(opt.letter)}>
                    {opt.letter}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Slide>
      );
    } else {
      const comboIndex = quizIndex - alphabetData.length;
      const [firstIdx, secondIdx] = combinationIndices[comboIndex];
      const first = alphabetData[firstIdx];
      const second = alphabetData[secondIdx];

      return (
        <Slide direction="up">
          <Box textAlign="center" mt={4}>
            <Typography variant="h6" gutterBottom>Type the word for these two signs</Typography>
            <Box display="flex" justifyContent="center" gap={2} mb={2}>
              <Image src={first.image} alt={first.letter} width={120} height={120} style={{ borderRadius: 10 }} />
              <Image src={second.image} alt={second.letter} width={120} height={120} style={{ borderRadius: 10 }} />
            </Box>
            <TextField label="Enter the combination" value={inputAnswer} onChange={(e) => setInputAnswer(e.target.value)} variant="outlined" />
            <Box mt={2}>
              <Button variant="contained" color="secondary" onClick={handleInputAnswer} disabled={!inputAnswer.trim()}>
                Submit Answer
              </Button>
            </Box>
          </Box>
        </Slide>
      );
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <ReactHowler src="/sounds/bg-music.mp3" playing={bgPlaying} loop volume={0.3} />

      <Typography variant="h4" align="center" sx={{ color: 'white' }} fontWeight={700} gutterBottom>
        MSL Alphabet Lesson
      </Typography>
      <Typography align="center" sx={{ color: 'white' }} fontWeight={500} gutterBottom>
        MSL Alphabet Lesson
      </Typography>

      {renderMilestoneButtons()}

      {currentStep === 'quiz' && !showContinuePrompt && !showCertificate && renderQuizMode()}

      {showContinuePrompt && !showCertificate && (
        <Box textAlign="center" mt={6}>
          <Avatar alt="Encouragement" src="/images/avatars/clap.gif" sx={{ width: 100, height: 100, margin: 'auto' }} />
          <Typography variant="h6" color="primary" gutterBottom>
            🎉 Great job! You've completed {quizIndex + 1} quizzes!
          </Typography>
          <Typography variant="body1" gutterBottom>Ready for the next batch?</Typography>
          <Button variant="contained" color="primary" onClick={handleContinue}>Continue</Button>
        </Box>
      )}

      {showCertificate && (
        <Box textAlign="center" mt={8}>
          <Avatar alt="Certificate" src="/images/avatars/certificate.png" sx={{ width: 120, height: 120, margin: 'auto' }} />
          <Typography variant="h5" color="success.main" gutterBottom>🏅 Congratulations!</Typography>
          <Typography variant="body1">You've completed the MSL Alphabet Course. Keep going strong!</Typography>
        </Box>
      )}

      
    </Box>
  );
}
