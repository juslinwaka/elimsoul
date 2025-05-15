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
   updateDoc,
} from 'firebase/firestore';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import '@/app/src/styles.css';

interface Reply {
  id: string;
  text: string;
  author: string;
  createdAt: any;
}

interface RoomData {
  url: string;
  expiresAt: Timestamp;
}

export default function TopicPage() {
  const { id } = useParams();
  const [topic, setTopic] = useState<any>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [room, setRoom] = useState<RoomData | null>(null);
  const [videoRoomUrl, setVideoRoomUrl] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(false);

  // load reply author from local storage
  useEffect(() => {
    const savedAuthor = localStorage.getItem('replyAuthor');
    if (savedAuthor) setReplyAuthor(savedAuthor);
  }, []);

  // Fetch topic and replies
  useEffect(() => {
    const fetchTopicAndRoom = async () => {
      const topicRef = doc(db, 'topics', id as string);
      const topicSnap = await getDoc(topicRef);
      if (topicSnap.exists()) {
        const data = topicSnap.data();
        setTopic({ id: topicSnap.id, ...data });

        // Check for room
        if (data.roomUrl) {
          setVideoRoomUrl(data.roomUrl);
          setRoom({ url: data.roomUrl, expiresAt: data.expiresAt });
        }
      }
    };

    // Fetch topic and room data
    fetchTopicAndRoom();

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

  //start a call
   const handleCreateRoom = async () => {
    if (!replyAuthor.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('/api/daily-api/create-room', {
        method: 'POST',
      });

      const data = await response.json();
      if (data?.url) {
        const newRoom = {
          url: data.url,
          expiresAt: Timestamp.now(),
        };

        setRoom(newRoom);
        setVideoRoomUrl(data.url);
        setCurrentUser(replyAuthor); // Set the creator

        const topicRef = doc(db, 'topics', id as string);
        await updateDoc(topicRef, {
          roomUrl: data.url,
          roomCreator: replyAuthor,
          expiresAt: newRoom.expiresAt
        });

      }
    }catch(error){
      console.error('Error creating room:', error);
    }finally{
      setLoading(false);
    }
  };

  // add reply
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

  const handleJoinCall = () => {
    if (room?.url) {
      window.open(room.url, '_blank');
    }
  };

  if (!topic) return <Typography>Loading topic...</Typography>;

  return (
    <main className="p-6">
      <Typography color="primary" variant="h4" gutterBottom>
        {topic.title}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Author: {topic.author}
      </Typography>

      {room && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleJoinCall}
          sx={{ marginTop: 2 }}
        >
          🔴 Join Live Chat
        </Button>
      )}

      <Divider className="my-4" />

      <Button
          variant="contained"
          color="secondary"
          onClick={handleCreateRoom}
          disabled={!replyAuthor.trim() || loading || !!videoRoomUrl}
          sx={{ marginTop: 2 }}
        >
           🟢 {loading ? 'Creating Room...' : 'Start A Call'}
        </Button>
      <Divider className="my-4" style={{margin:3}}/>

      <Typography variant="h6" gutterBottom>
        Replies
      </Typography>

      {replies.map((reply) => (
        <Paper
          key={reply.id}
          className="p-3 my-2"
          sx={{ padding: '5px', margin: 2 }}
          style={{ backgroundColor: 'white', color: 'black' }}
        >
          <Typography fontWeight="600">{reply.text}</Typography>
          <Typography variant="caption" color="inherit">
            — {reply.author} |{' '}
            {reply.createdAt?.toDate().toLocaleString() || 'Unknown date'}
          </Typography>
        </Paper>
      ))}

      <Divider className="my-4" />
      
            <Typography variant="h6" color='success' gutterBottom style={{color: 'black'}}>
              Add a Reply
            </Typography>
            <TextField
              label="Your Name"
              fullWidth
               sx={{
                  input: {color: 'white'},
                  label: {color: 'white'},
                  marginBottom: '5px'
                    }}
              className="mb-2"
              value={replyAuthor}
              onChange={(e) => setReplyAuthor(e.target.value)}
            />
      <TextField
              label="Your Reply"
              fullWidth
              multiline
              sx={{
                  input: {color: 'white'},
                  label: {color: 'white'},
                    }}
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
