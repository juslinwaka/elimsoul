'use client'

import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Button, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { arrayUnion, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useScreenConfig } from '@/hooks/screenConfig';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

interface Props {
  lessonId: string;
  fileUrl: string;
  onCompleteFinal: () => void;
}

export default function PDFLessonViewer({ lessonId, fileUrl, onCompleteFinal }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [quizPassed, setQuizPassed] = useState(false);
  const [unlockedPages, setUnlockedPages] = useState<number[]>([]);
  const [isCompleteTriggered, setIsCompleteTriggered] = useState(false);
  const { isMobile, isDesktop } = useScreenConfig();
  const user = getAuth().currentUser;

  useEffect(() => {
    if (user) {
      const docRef = doc(db, `users/${user.uid}/progress`, lessonId);
      getDoc(docRef).then(snapshot => {
        const data = snapshot.data();
        if (data?.unlockedPages) {
          setUnlockedPages(data.unlockedPages);
          const lastUnlocked = Math.max(...data.unlockedPages);
          setPageNumber(Math.min(lastUnlocked, data.unlockedPages.length));
        }
      });
    }
  }, [user, lessonId]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handleNextPage = () => {
    const nextPage = pageNumber + 1;
    if (nextPage <= (numPages || 1)) {
      setPageNumber(nextPage);
      setQuizPassed(false);
    }
  };

  const handleQuizPass = async () => {
    const nextPage = pageNumber + 1;
    setQuizPassed(true);

    if (user && numPages) {
      const cappedPage = Math.min(nextPage, numPages);
      const cappedProgress = Math.min(Math.round((cappedPage / numPages) * 100), 100);

      const docRef = doc(db, `users/${user.uid}/progress`, lessonId);
      await setDoc(docRef, {
        unlockedPages: arrayUnion(cappedPage),
        progress: cappedProgress,
      }, { merge: true });

      if (cappedPage < numPages) {
        setPageNumber(cappedPage);
      } else {
        // Final page reached
        if (!isCompleteTriggered) {
          setIsCompleteTriggered(true);
          setTimeout(() => {
            onCompleteFinal();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 500);
        }
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: 'white', p: 2 }}>
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} width={isMobile ? 320 : 900} />
      </Document>

      <Typography align="center" mt={1}>Page {pageNumber} of {numPages}</Typography>

      {numPages && (
        <>
          {pageNumber < numPages && (
            <Box display="flex" justifyContent="center" mt={2}>
              {!quizPassed && !unlockedPages.includes(pageNumber + 1) ? (
                <MiniQuizInline onPass={handleQuizPass} />
              ) : (
                <Button variant="contained" onClick={handleNextPage}>Next Page</Button>
              )}
            </Box>
          )}

          {pageNumber === numPages && !quizPassed && (
            <Box mt={3} textAlign="center">
              <Typography variant="h6">🎉 You've reached the final page!</Typography>
              <MiniQuizInline onPass={handleQuizPass} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

function MiniQuizInline({ onPass }: { onPass: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (selected === 1) {
      setFeedback('✅ Correct!');
      setTimeout(() => {
        setFeedback('');
        onPass();
      }, 800);
    } else {
      setFeedback('❌ Try again!');
    }
  };

  return (
    <Box mt={2}>
      <Typography>What is the MSL sign for "Hello"?</Typography>
      <Button onClick={() => setSelected(1)}>Wave Hand 🤟</Button>
      <Button onClick={() => setSelected(2)}>Point Up 👆</Button>
      <Button onClick={() => setSelected(3)}>Touch Nose 👃</Button>
      <Box mt={1}>
        <Button variant="outlined" onClick={handleSubmit}>Submit</Button>
      </Box>
      {feedback && <Typography mt={1}>{feedback}</Typography>}
    </Box>
  );
}
