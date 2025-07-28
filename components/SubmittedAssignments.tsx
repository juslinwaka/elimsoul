'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box, Typography, Card, CardContent, CardActions, Button,
  TextField, CircularProgress, Grid
} from '@mui/material';
import { db, auth } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  updateDoc,
  collection,
  collectionGroup,
  Timestamp
} from 'firebase/firestore';

interface Submission {
  id: string;
  studentId: string;
  lessonRef: string;
  assignmentId: string;
  videoUrl: string;
  submittedAt: string;
  feedback?: string;
  grade?: string;
  title?: string;
  description?: string;
}

export default function SubmittedAssignments() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        // Fetch all submissions using collectionGroup
        const snapshot = await getDocs(collectionGroup(db, 'students'));
        const items: Submission[] = [];

        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            studentId: data.studentId || '',
            lessonRef: data.lessonRef || '',
            assignmentId: data.assignmentId || '',
            videoUrl: data.videoUrl || '',
            submittedAt: data.submittedAt?.toDate?.() ? data.submittedAt.toDate().toLocaleString() : '',
            feedback: data.feedback || '',
            grade: data.grade || '',
            title: data.title || '',
            description: data.description || ''
          });
        });

        console.log('Fetched submissions:', items);
        setSubmissions(items);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const handleSave = async (submission: Submission) => {
    setSaving(submission.id);
    try {
      // Correct Firestore path for submission document
      const ref = doc(db, 'students', submission.studentId, 'assignments', submission.assignmentId, 'submissions', submission.id);
      await updateDoc(ref, {
        feedback: submission.feedback,
        grade: submission.grade
      });
      alert('✅ Feedback and grade saved!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to save feedback.');
    } finally {
      setSaving(null);
    }
  };

  const handleChange = (id: string, key: 'feedback' | 'grade', value: string) => {
    setSubmissions(prev =>
      prev.map(s =>
        s.id === id ? { ...s, [key]: value } : s
      )
    );
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box width='100%'>
      <Typography sx={{color: 'white'}} variant="h5" mb={3}>📹 Submitted Assignments</Typography>
      <Grid container spacing={3}>
        {submissions.length === 0 ? (
          <Grid size={12}>
            <Typography color="text.secondary" align="center" mt={4}>
              No assignments found.
            </Typography>
          </Grid>
        ) : (
          submissions.map((sub) => (
            <Grid size={12} key={sub.id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1"><strong>Student:</strong> {sub.studentId}</Typography>
                  <Typography variant="subtitle2"><strong>Lesson:</strong> {sub.lessonRef}</Typography>
                  <Typography variant="body2" color="text.secondary"><strong>Submitted At:</strong> {sub.submittedAt || 'Not submitted yet'}</Typography>
                  <Typography variant="body2" color="text.secondary"><strong>Title:</strong> {sub.title || 'No title'}</Typography>
                  <Typography variant="body2" color="text.secondary"><strong>Description:</strong> {sub.description || 'No description'}</Typography>

                  <Box mt={2}>
                    {sub.videoUrl ? (
                      <video src={sub.videoUrl} controls width="100%" />
                    ) : (
                      <Typography color="error">No video submitted yet.</Typography>
                    )}
                  </Box>

                  <Box mt={2}>
                    <TextField
                      label="Feedback"
                      fullWidth
                      multiline
                      rows={2}
                      value={sub.feedback}
                      onChange={(e) => handleChange(sub.id, 'feedback', e.target.value)}
                    />
                  </Box>

                  <Box mt={2}>
                    <TextField
                      label="Grade"
                      fullWidth
                      value={sub.grade}
                      onChange={(e) => handleChange(sub.id, 'grade', e.target.value)}
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    onClick={() => handleSave(sub)}
                    disabled={saving === sub.id}
                  >
                    {saving === sub.id ? 'Saving…' : 'Save Feedback'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
