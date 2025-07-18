'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Input,
} from '@mui/material';
import { UploadFile } from '@mui/icons-material';

export default function AssignmentView() {
  const params = useParams();
  const assignmentId = params?.id as string;
  const [assignment, setAssignment] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!user || !assignmentId) return;
      const ref = doc(db, 'students', user.uid, 'assignments', assignmentId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setAssignment(snap.data());
        if (snap.data().submittedAt) setSubmitted(true);
        if (snap.data().videoUrl) setVideoUrl(snap.data().videoUrl);
      }
    };
    fetchAssignment();
  }, [user, assignmentId]);

  const handleUpload = async () => {
    if (!file || !user) return;

    setUploading(true);

    try {
      const res = await fetch(`/api/r2/upload-url?filename=${file.name}`);
      const { uploadURL, key } = await res.json();

      const uploadRes = await fetch(uploadURL, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Video upload failed');
      }

      const videoPublicUrl = `https://pub-94eeff28256f46ffacbde082ed48e9c3.r2.dev/${key}`;
      const ref = doc(db, 'students', user.uid, 'assignments', assignmentId);
       setDoc(ref, {
        videoUrl: videoPublicUrl,
        status: 'submitted',
        submittedAt: Timestamp.now(),
      }, { merge: true }); 

        setVideoUrl(videoPublicUrl);
        setSubmitted(true);
      } catch (err) {
        console.error("Upload failed:", err);
      }

      setUploading(false);
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
      <Paper sx={{ p: 4 }}>
        <Typography sx={{color: 'white'}} variant="h5" fontWeight={500} gutterBottom>
          {assignment.title}
        </Typography>
        <Typography sx={{color: 'white'}} variant="body1" mb={2}>
          {assignment.description}
        </Typography>
        <Typography variant="caption" color="gray">
          Due: {assignment.dueAt?.toDate().toDateString()}
        </Typography>

        {submitted ? (
          <Typography mt={4} color="success.main">
            ✅ Assignment Submitted! Link:{' '}
            <a href={videoUrl} target="_blank" rel="noopener noreferrer">View Video</a>
          </Typography>
        ) : (
          <Box mt={4}>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0] || null)}
              disabled={uploading}
              style={{ marginTop: 8, marginBottom: 8 }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              startIcon={<UploadFile />}
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              {uploading ? 'Uploading...' : 'Submit Assignment'}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
