'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import {
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useScreenConfig } from '@/hooks/screenConfig';
import '@/app/src/styles.css';

interface Topic {
  id: string;
  title: string;
  author: string;
  createdAt: any;
}

export default function MessageBoard() {
  const { isMobile, isDesktop } = useScreenConfig();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'topics'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Topic[];

      setTopics(data);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateTopic = async () => {
    if (!newTitle.trim() || !authorName.trim()) return;

    await addDoc(collection(db, 'topics'), {
      title: newTitle.trim(),
      author: authorName.trim(),
      createdAt: Timestamp.now(),
    });

    setNewTitle('');
    setAuthorName('');
    setOpenDialog(false);
  };

  return (
    <main className="p-6 bg-gradient-blue" >
      <Grid p={2} spacing={2} container justifyContent='center' className="mb-4">

        {isMobile &&(
          <Grid size={12}>
            <Typography pt={5} variant="h4" fontSize={40} fontWeight={600} className='text-white' gutterBottom>
              Discussion Topics
            </Typography>
          </Grid>
        )}

        {isDesktop &&(
            <Typography pt={10} variant="h2" fontSize={60} fontWeight={600} className='text-white' gutterBottom>
              Discussion Topics
            </Typography>
         
        )}
       

        <Grid size={12} >
          <Button
        variant="contained"
        color='success'
        onClick={() => setOpenDialog(true)}
        className="mb-4"
      >
        Create New Topic
      </Button>
        </Grid>

      </Grid>

      <Grid container spacing={2} p={2} >
        {topics.length > 0 ? (
          topics.map((topic) => (
            <Grid key={topic.id} justifyContent='center' justifySelf='center' justifyItems='center'>
              <Paper elevation={4} className="p-4" style={{backgroundColor: '#f5f5f5'}} >
                <Typography variant="h6">{topic.title}</Typography>
                <Chip label={`By: ${topic.author}`} className="mr-2 my-2" />
                <Typography variant="body2" >
                  {topic.createdAt?.toDate().toLocaleString() || 'Unknown Date'}
                </Typography>
                <Link href={`/messages/${topic.id}`}>
                  <Button size='small' fullWidth variant="contained" className="mt-3">
                    View & Reply
                  </Button>
                </Link>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography>No topics found.</Typography>
        )}
      </Grid>

      {/* Create Topic Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Topic</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Topic Title"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Author Name"
            fullWidth
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateTopic} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
