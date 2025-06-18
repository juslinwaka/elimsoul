import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface QuizProps {
  lessonId: string;
  nextLessonId: string;
  onComplete: (passed: boolean) => void;  // Add the onComplete prop
}

const MiniQuiz: React.FC<QuizProps> = ({ lessonId, nextLessonId, onComplete }) => {
  const [score, setScore] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(5); // Define total questions
  const [submitted, setSubmitted] = useState<boolean>(false);
  const user = auth.currentUser;

  const handleQuizSubmit = async () => {
    const percentage = (score / totalQuestions) * 100;

    if (percentage >= 70) {
      // Update Firestore if the score is sufficient to unlock the next lesson
      if (!user) return;

      const lessonRef = doc(db, 'users', user.uid, 'progress', lessonId);
      await setDoc(lessonRef, { progress: 70 }, { merge: true });

      // Unlock next lesson
      const nextLessonRef = doc(db, 'users', user.uid, 'progress', nextLessonId);
      await setDoc(nextLessonRef, { progress: 0 }, { merge: true });

      // Notify the parent that the quiz is passed
      onComplete(true);
      alert('You passed the quiz! Lesson progress updated.');
    } else {
      // Notify the parent that the quiz is failed
      onComplete(false);
      alert('You need at least 70% to move to the next lesson.');
    }

    setSubmitted(true);
  };

  return (
    <Box>
      <Typography variant="h5">Mini Quiz: Answer the questions below</Typography>
      {/* Example questions */}
      <TextField
        label="Question 1"
        variant="outlined"
        fullWidth
        onChange={(e) => setScore(e.target.value === 'correct' ? score + 1 : score)}
      />
      <TextField
        label="Question 2"
        variant="outlined"
        fullWidth
        onChange={(e) => setScore(e.target.value === 'correct' ? score + 1 : score)}
      />
      {/* Add more questions as needed */}

      <Box mt={2}>
        <Button onClick={handleQuizSubmit} variant="contained" fullWidth>
          Submit Quiz
        </Button>
      </Box>

      {submitted && (
        <Typography variant="body1" color="textSecondary" mt={2}>
          {score} / {totalQuestions} correct ({(score / totalQuestions) * 100}%)
        </Typography>
      )}
    </Box>
  );
};

export default MiniQuiz;
