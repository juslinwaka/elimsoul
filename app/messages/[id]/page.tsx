'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
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
  Grid,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import '@/app/src/styles.css';

// Add this declaration to let TypeScript know about JitsiMeetExternalAPI
declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

interface Reply {
  id: string;
  text: string;
  author: string;
  createdAt: any;
}

interface RoomData {
  url: string;
  token?: string;
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
  const [showJitsi, setShowJitsi] = useState(false);
  const [loading, setLoading] = useState(false);
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [jitsiScriptLoaded, setJitsiScriptLoaded] = useState(false);
  const [jwtToken, setJwtToken] = useState('');


  useEffect(() => {
    if(!jitsiScriptLoaded){
      const script = document.createElement('script');
      script.src = 'https://8x8.vc/vpaas-magic-cookie-2353fabe982545eda026650e82946a9d/external_api.js';
      script.async = true;
      script.onload = () => setJitsiScriptLoaded(true);
      document.body.appendChild(script);
    }
  }, []);

    useEffect(() => {
    if (jitsiScriptLoaded && showJitsi && jitsiContainerRef.current) {
      const domain = '8x8.vc';

      const options = {
        roomName:  `ElimSoul-${id}`,
        parentNode: jitsiContainerRef.current,
        userInfo: {
          id: 'ElimSoul',
          displayName: currentUser.trim(),
          moderator: true,
        },
        configOverwrite: {
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
        },
        jwt: room?.token,
      };

      new window.JitsiMeetExternalAPI(domain, options);
    }
  }, [jitsiScriptLoaded, showJitsi, room?.token]);

  // load reply author from local storage
  useEffect(() => {
    const savedAuthor = localStorage.getItem('replyAuthor');
    const saveToken = localStorage.getItem('jwtToken');
    if (saveToken) setJwtToken(saveToken);
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
          setRoom({ url: data.roomUrl, expiresAt: data.expiresAt, token: data.token });
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

   const handleStartCall = async () => {
    setLoading(true)
    if (!replyAuthor.trim()) return;

    try{
      const roomName = `ElimSoul-${id}`;
      const userId = id;
      const displayName = replyAuthor.trim();

      const response = await fetch('/api/jsonwebtoken/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomName, userId, displayName }),
      });

      if(!response.ok){
        const error = await response.json();
        console.error('Error creating room:', error || 'Failed to create JWT');
      }

      const data = await response.json();
      const jwtToken = data.token;

      const fullRoomUrl = `https://8x8.vc/${process.env.NEXT_PUBLIC_JAAS_APP_ID}/${roomName}#jwt=${jwtToken}`;

      const newRoom = {
        url: fullRoomUrl,
        expiresAt: Timestamp.now(),
      };

      setRoom(newRoom);
      setShowJitsi(true);

      const topicRef = doc(db, 'topics', id as string);
      await updateDoc(topicRef, {
        roomUrl: fullRoomUrl,
        roomCreator: replyAuthor.trim(),
        token: jwtToken,
        expiresAt: Timestamp.now(),
      });
    }catch (error) {
      console.error('Error starting call:', error);
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
    console.log(jitsiContainerRef)
    setShowJitsi(true);
  };


  if (!topic) return <Typography>Loading topic...</Typography>;

  return (
    <main className="p-6" style={{ position: 'relative'}}>
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
          disabled={!room.url || loading || !!replyAuthor.trim()}
          sx={{ marginTop: 2 }}
        >
          🔴 Join Live Chat
        </Button>
      )}

      <Divider className="my-4" style={{margin:3}}/>


    {showJitsi && (
      <Grid sx={{margin: 20}}>
        
        <iframe
          src='https://8x8.vc/${process.env.NEXT_PUBLIC_JAAS_APP_ID}/${room?.url}#jwt=${room?.token}'
          style={{
            width: '100%',
            height: '500px',
            border: 'none',
            position: 'absolute',
            top: 60,
            left: 5,
            right: 5,
            zIndex: 9999,
          }}/>
        </Grid>
    )}
      <Divider className="my-4" style={{margin:3}}/>

      <Button
          variant="contained"
          color="secondary"
          onClick={handleStartCall}
          disabled={!replyAuthor.trim() || loading || !!videoRoomUrl}
          sx={{ marginTop: 2 }}
        >
           🟢 {loading ? 'Creating Room...' : 'Start A Call'}
        </Button>
      <Divider className="my-4" style={{margin:3}}/>

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
