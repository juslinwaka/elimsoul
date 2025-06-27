// components/instructors/AssignmentForm.tsx

'use client';

import { useState } from 'react';
import {
  Box, TextField, Button, Typography, MenuItem, Paper
} from '@mui/material';
import { Timestamp, doc, setDoc, collection } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useToast } from '@/hooks/toast';

export default function AssignmentForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [targetStudent, setTargetStudent] = useState('');
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!title || !dueDate || !targetStudent) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }

    const assignmentId = `${Date.now()}`;
    const instructorId = auth.currentUser?.uid;

    const payload = {
      id: assignmentId,
      title,
      description,
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      instructorId,
      studentId: targetStudent,
      createdAt: Timestamp.now(),
      status: 'pending',
    };

    try {
      // Save under instructor
      await setDoc(
        doc(db, 'instructors', instructorId!, 'assignments', assignmentId),
        payload
      );

      // Also store in student side
      await setDoc(
        doc(db, 'students', targetStudent, 'assignments', assignmentId),
        payload
      );

      showToast('✅ Assignment sent successfully!', 'success');
      setTitle('');
      setDescription('');
      setDueDate('');
      setTargetStudent('');
    } catch (error) {
      console.error(error);
      showToast('❌ Failed to send assignment.', 'error');
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        📘 Create Assignment
      </Typography>

      <TextField
        label="Title"
        fullWidth
        size="small"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ my: 1 }}
      />

      <TextField
        label="Description"
        fullWidth
        size="small"
        multiline
        minRows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ my: 1 }}
      />

      <TextField
        label="Due Date"
        fullWidth
        type="date"
        size="small"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        sx={{ my: 1 }}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label="Target Student UID"
        fullWidth
        size="small"
        value={targetStudent}
        onChange={(e) => setTargetStudent(e.target.value)}
        sx={{ my: 1 }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        🚀 Send Assignment
      </Button>
    </Paper>
  );
}
