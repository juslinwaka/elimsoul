'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { db } from '@/lib/firebase';
import {
  addDoc,
  collection,
  getDocs,
  Timestamp,
  query,
  orderBy
} from 'firebase/firestore';

export default function InstructorPosts() {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    const postsRef = collection(db, 'announcements');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(fetched);
  };

  const submitPost = async () => {
    if (!postContent.trim()) return;

    await addDoc(collection(db, 'announcements'), {
      content: postContent,
      createdAt: Timestamp.now()
    });

    setPostContent('');
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        📢 Post Announcement or Quiz
      </Typography>

      <TextField
        label="Write a post or quiz question..."
        fullWidth
        multiline
        rows={4}
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        sx={{ my: 2 }}
      />

      <Button variant="contained" onClick={submitPost}>
        Post Now
      </Button>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        📜 Previous Posts
      </Typography>

      <List>
        {posts.map((post) => (
          <ListItem key={post.id} alignItems="flex-start">
            <ListItemText
              primary={post.content}
              secondary={new Date(post.createdAt.seconds * 1000).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
