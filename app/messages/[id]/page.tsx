'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import '@/app/src/styles.css'

interface Reply {
  id: string;
  text: string;
  author: string;
  createdAt: any;
}

export default function TopicPage() {
  const { id } = useParams();
  const [topic, setTopic] = useState<any>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');

  useEffect(() => {
    const fetchTopic = async () => {
      const docRef = doc(db, 'topics', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTopic({ id: docSnap.id, ...docSnap.data() });
      }
    };

    fetchTopic();

    const repliesRef = collection(db, 'topics', id as string, 'replies');
    const q = query(repliesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Reply[];

      setReplies(data);
    });

    return () => unsubscribe();
  }, [id]);

  const handleReply = async () => {
    if (!replyText.trim() || !replyAuthor.trim()) return;

    await addDoc(collection(db, 'topics', id as string, 'replies'), {
      text: replyText.trim(),
      author: replyAuthor.trim(),
      createdAt: Timestamp.now(),
    });

    setReplyText('');
    setReplyAuthor('');
  };

  if (!topic) return <Typography>Loading topic...</Typography>;

  return (
    <main className="p-6">
      <Typography color='primary' variant="h4" gutterBottom sx={{}}>
        {topic.title}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Author: {topic.author}
      </Typography>
      <Divider className="my-4" />

      <Typography variant="h6" gutterBottom>
        Replies
      </Typography>

      {replies.map((reply) => (
        <Paper key={reply.id} className="p-3 my-2" sx={{padding: '5px', margin: 2}} style={{backgroundColor: 'white', color: 'black' }}>
          <Typography fontWeight='600'>{reply.text}</Typography>
          <Typography variant="caption" color='inherit'>
            — {reply.author} |{' '}
            {reply.createdAt?.toDate().toLocaleString() || 'Unknown date'}
          </Typography>
        </Paper>
      ))}

      <Divider className="my-4" />

      <Typography variant="h6" color='success' gutterBottom>
        Add a Reply
      </Typography>
      <TextField
        label="Your Name"
        fullWidth
        className="mb-2"
        value={replyAuthor}
        onChange={(e) => setReplyAuthor(e.target.value)}
      />
      <TextField
        label="Your Reply"
        fullWidth
        multiline
        rows={3}
        className="mb-2"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
      <Button variant="contained" color="success" onClick={handleReply}>
        Submit Reply
      </Button>
    </main>
  );
}
