import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const MiniQuiz = ({ onPass }: { onPass: () => void }) => {
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    if (score >= 70) {
      onPass();
    } else {
      alert("Try again! You need at least 70% to pass.");
    }
  };

  return (
    <Box>
      {/* Replace with actual quiz questions */}
      <Typography>Quiz: What is the MSL sign for A?</Typography>
      {/* ...multiple choice options... */}
      <Button onClick={handleSubmit}>Submit Quiz</Button>
    </Box>
  );
};
