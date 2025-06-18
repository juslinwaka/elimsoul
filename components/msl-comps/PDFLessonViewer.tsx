// components/PDFLessonViewer.tsx
'use client'

import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Button, Typography, Grid } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { arrayUnion, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useScreenConfig } from '@/hooks/screenConfig';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

interface Props {
  lessonId: string;
  fileUrl: string;
}

export default function PDFLessonViewer({ lessonId, fileUrl }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [quizPassed, setQuizPassed] = useState(false);
  const [unlockedPages, setUnlockedPages] = useState<number[]>([]);
  const {isMobile, isDesktop} = useScreenConfig();

  const user = getAuth().currentUser;

  useEffect(() => {
    if (user) {
      const docRef = doc(db, `users/${user.uid}/lessons/${lessonId}`);
      getDoc(docRef).then(snapshot => {
        const data = snapshot.data();
        if (data?.unlockedPages) {
          setUnlockedPages(data.unlockedPages);
        }
      });
    }
  }, [user, lessonId]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handleNextPage = async () => {
    const nextPage = pageNumber + 1;
    if (!unlockedPages.includes(nextPage)) {
      setQuizPassed(false);
    } else {
      setPageNumber(nextPage);
    }
  };

  const handleQuizPass = async () => {
    setQuizPassed(true);
    const nextPage = pageNumber + 1;
    setPageNumber(nextPage);

    if (user) {
      const docRef = doc(db, `users/${user.uid}/lessons/${lessonId}`);
      await setDoc(docRef, {
        unlockedPages: arrayUnion(nextPage),
        progress: Math.round((nextPage / (numPages || 1)) * 100),
      }, { merge: true });
    }
  };

  return (
   <Box>
    {isMobile && (
        <Box sx={{backgroundColor: 'white'}}>
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} width={300} />
      </Document>
      <Typography align="center">Page {pageNumber} of {numPages}</Typography>

      {numPages && pageNumber < numPages && (
        <Box display="flex" justifyContent="center" mt={2}>
          {!quizPassed && !unlockedPages.includes(pageNumber + 1) ? (
            <MiniQuiz onPass={handleQuizPass} />
          ) : (
            <Button variant="contained" onClick={handleNextPage}>Next Page</Button>
          )}
        </Box>
      )}
    </Box>
    )}
   </Box>
    
  );
}

function MiniQuiz({ onPass }: { onPass: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (selected === 1) { // assuming option 1 is correct
      setFeedback('✅ Correct!');
      setTimeout(onPass, 1000);
    } else {
      setFeedback('❌ Try again!');
    }
  };

  return (
    <Box>
      <Typography>What is the MSL sign for "Hello"?</Typography>
      <Button onClick={() => setSelected(1)}>Wave Hand 🤟</Button>
      <Button onClick={() => setSelected(2)}>Point Up 👆</Button>
      <Button onClick={() => setSelected(3)}>Touch Nose 👃</Button>
      <Box mt={1}><Button variant="outlined" onClick={handleSubmit}>Submit</Button></Box>
      {feedback && <Typography>{feedback}</Typography>}
    </Box>
  );
}
