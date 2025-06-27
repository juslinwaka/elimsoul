// components/instructors/SubmissionReview.tsx

'use client';

import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, TextField, MenuItem, CircularProgress
} from '@mui/material';
import { db, auth } from '@/lib/firebase';
import { collectionGroup, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/toast';

interface Submission {
  id: string;
  studentId: string;
  assignmentId: string;
  content: string;
  submittedAt: any;
  status: string;
  feedback: string;
}

export default function SubmissionReview() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const snapshot = await getDocs(collectionGroup(db, 'submissions'));
        const items: Submission[] = [];

        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            studentId: data.studentId,
            assignmentId: data.assignmentId,
            content: data.content,
            submittedAt: data.submittedAt,
            status: data.status || 'pending',
            feedback: data.feedback || '',
          });
        });

        setSubmissions(items);
      } catch (err) {
        console.error(err);
        showToast('Failed to load submissions', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleReview = async (submission: Submission, newStatus: string, feedback: string) => {
    try {
      const ref = doc(
        db,
        'students',
        submission.studentId,
        'assignments',
        submission.assignmentId,
        'submissions',
        submission.id
      );

      await updateDoc(ref, {
        status: newStatus,
        feedback,
        reviewedAt: new Date().toISOString(),
      });

      const instructorId = auth.currentUser?.uid;
      if (instructorId) {
        const reviewRef = doc(db, 'instructors', instructorId, 'reviews', submission.id);
        await setDoc(reviewRef, {
          ...submission,
          status: newStatus,
          feedback,
          reviewedAt: new Date().toISOString(),
        });
      }

      showToast('✅ Submission reviewed', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update submission', 'error');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        🧾 Review Student Submissions
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        submissions.map((submission) => (
          <Paper key={submission.id} sx={{ p: 2, my: 2 }}>
            <Typography fontWeight="bold">📚 Assignment ID: {submission.assignmentId}</Typography>
            <Typography>👤 Student ID: {submission.studentId}</Typography>
            <Typography mt={1}>📝 Answer: {submission.content}</Typography>
            <TextField
              label="Feedback"
              multiline
              fullWidth
              minRows={2}
              defaultValue={submission.feedback}
              sx={{ my: 2 }}
              onChange={(e) => (submission.feedback = e.target.value)}
            />
            <TextField
              select
              label="Mark as"
              defaultValue={submission.status}
              onChange={(e) => (submission.status = e.target.value)}
              sx={{ mr: 2, width: 200 }}
            >
              <MenuItem value="approved">✅ Approved</MenuItem>
              <MenuItem value="improve">❌ Needs Improvement</MenuItem>
            </TextField>
            <Button
              variant="contained"
              onClick={() => handleReview(submission, submission.status, submission.feedback)}
            >
              Submit Review
            </Button>
          </Paper>
        ))
      )}
    </Box>
  );
}
