'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/toast';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc, increment, collection, addDoc, Timestamp } from 'firebase/firestore';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import { Slide } from 'react-awesome-reveal';
import useSound from 'use-sound';
import ReactHowler from 'react-howler';
import {useRouter} from 'next/navigation'

import convoData from '@/data/msl-basic-cons.json';

interface BasicConvoProps {
  lessonId: string;
  nextLessonId?: string;
  onComplete: () => void;
}

const batchSize = 10;

export default function BasicConvo({ lessonId, nextLessonId, onComplete }: BasicConvoProps) {
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

  const totalLessons = convoData.length;

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
      title: 'Sign Basic Conversation',
      description: 'Make a peer video of you signing the basic conversation signs. Under ElimSoul Forum create a topic under your peer group name and start a call. Record the conversation and upload it here.',
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
    const correct = convoData[quizIndex % convoData.length].word;
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

  const nextQuiz = () => {
    setAttempts(0);
    const nextIndex = quizIndex + 1;
    if (nextIndex % batchSize === 0 && !isReviewMode) {
      setShowContinuePrompt(true);
      saveProgress();
    } else if (nextIndex >= convoData.length && !isReviewMode && failedIndices.length > 0) {
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

  const renderQuizMode = () => {
    if (quizIndex < convoData.length) {
      const index = quizIndex;
      const options = [
        convoData[index],
        convoData[(index + 1) % convoData.length],
        convoData[(index + 2) % convoData.length]
      ].sort(() => Math.random() - 0.5);

      return (
        <Slide direction="up">
          <Box textAlign="center" mt={4}>
            <Typography variant="h6" gutterBottom>
              What does this sign mean? {quizIndex + 1}
            </Typography>
            <Image
              src={convoData[index].image}
              alt="Quiz Sign"
              width={200}
              height={200}
              style={{ borderRadius: 12, marginBottom: 16 }}
            />
            <Grid container spacing={2} justifyContent="center">
              {options.map((opt, i) => (
                <Grid key={i}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleChoiceAnswer(opt.word)}
                  >
                    {opt.word}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Slide>
      );
    } else {
      const comboIndex = quizIndex - convoData.length;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <ReactHowler src="/sounds/bg-music.mp3" playing={bgPlaying} loop volume={0.3} />

      <Typography variant="h4" align="center" sx={{color: 'white'}} fontWeight={700} gutterBottom>
        MSL Basic Conversation Lesson
      </Typography>
      <Typography align="center" sx={{color: 'white'}} fontWeight={500} gutterBottom>
        Learn how to greet, thank, and introduce yourself in Malawian Sign Language. Start signing real conversations! today! 
      </Typography>

      {currentStep === 'quiz' && !showContinuePrompt && !showCertificate && renderQuizMode()}

      {showContinuePrompt && !showCertificate && (
        <Box textAlign="center" mt={6}>
          <Avatar
            alt="Encouragement"
            src="/images/avatars/clap.gif"
            sx={{ width: 100, height: 100, margin: 'auto' }}
          />
          <Typography variant="h6" color="primary" gutterBottom>
            🎉 Great job! You've completed {quizIndex + 1} quizzes!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Ready for the next batch?
          </Typography>
          <Button variant="contained" color="primary" onClick={handleContinue}>
            Continue
          </Button>
        </Box>
      )}

      {showCertificate && (
        <Box textAlign="center" mt={8}>
          <Avatar
            alt="Certificate"
            src="/images/avatars/certificate.png"
            sx={{ width: 120, height: 120, margin: 'auto' }}
          />
          <Typography variant="h5" color="success.main" gutterBottom>
            🏅 Congratulations!
          </Typography>
          <Typography variant="body1">
            You've completed the MSL Basic Conversation Course. Keep going strong!
          </Typography>
        </Box>
      )}

      {currentStep === 'learn' && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" gutterBottom>
            Let's learn the basics of daily conversation in MSL!
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {convoData.slice(0, 6).map((item, idx) => (
            <Grid key={idx}>
              <Box sx={{ p: 1, bgcolor: '#fff3', borderRadius: 2 }}>
                <Image src={item.image} alt={item.word} width={120} height={120} style={{ borderRadius: 8 }} />
                <Typography color="white">{item.word}</Typography>
              </Box>
            </Grid>
            ))}
          </Grid>
            <Button variant="contained" color="primary" size="large" onClick={() => setCurrentStep('quiz')} sx={{ mt: 4 }}>
              Start Conversation Challenges
        </Button>
  </Box>
)}

    </Box>
  );
}
