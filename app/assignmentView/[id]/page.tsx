'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Paper,
} from '@mui/material';
import { UploadFile } from '@mui/icons-material';

export default function AssignmentView() {
  const params = useParams();
  const assignmentId = params?.id as string;
  const [assignment, setAssignment] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!user || !assignmentId) return;
      const ref = doc(db, 'students', user.uid, 'assignments', assignmentId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setAssignment(snap.data());
        if (snap.data().submittedAt) setSubmitted(true);
      }
    };
    fetchAssignment();
  }, [user, assignmentId]);

  const handleSubmit = async () => {
    if (!videoUrl || !user) return;
    setSubmitting(true);
    const ref = doc(db, 'students', user.uid, 'assignments', assignmentId);
    await setDoc(ref, {
      videoUrl,
      status: 'submitted',
      submittedAt: Timestamp.now(),
    }, { merge: true });
    setSubmitted(true);
    setSubmitting(false);
  };

  if (!assignment) {
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Paper sx={{ p: 4, backgroundColor: 
          'rgba(02, 205, 255, 0.6)' }}>
        <Typography color="white" variant="h5" fontWeight={500} gutterBottom>
          {assignment.title}
        </Typography>
        <Typography color='white' variant="body1" mb={2}>
          {assignment.description}
        </Typography>
        <Typography variant="caption" color="black">
          Due: {assignment.dueAt?.toDate().toDateString()}
        </Typography>

        {submitted ? (
          <Typography mt={4} color="success.main">
            ✅ Assignment Submitted. Awaiting review.
          </Typography>
        ) : (
          <Box mt={4}>
            <TextField
              fullWidth
              sx={{marginTop: 2,
                            input: {color: 'white'},
                            label: {color: 'white'},
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }}
              label="Video Link (YouTube, Google Drive, etc)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              disabled={submitting}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              startIcon={<UploadFile />}
              onClick={handleSubmit}
              disabled={!videoUrl || submitting}
            >
              Submit Assignment
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
