'use client'
import {Grid,
   Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  TextField} from '@mui/material/'
import ProtectedRoute from '@/components/ProtectedRoute'
import React, {useState} from 'react'
import { useToast } from '@/hooks/toast';


export default function Summerizer() {
  const [input, setInput] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const {showToast, Toast} = useToast();

  const handleSummarize = async () => {
    setLoading(true);
    setError('');
    setSummary('');

    try{
      const response = await fetch('https://juslin-elim-api.hf.space/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to summarize text');
      }

      const data = await response.json();
      setSummary(data.summary);
      }catch{
        setError('Failed to summarize text');
        showToast("Failed to summarize text", "error");
      }finally{
        setLoading(false);
      }
  };



  return (
    <div >
    <ProtectedRoute>
      <title>Summerizer Ai | ElimSoul</title>
        <Grid container spacing={2} sx={{height: '100vh', paddingTop: 7}}>
          <Grid size={12} sx={{
            '& .MuiDrawer-paper': {
              backgroundColor: 'white', // or use `#fff`
            },
          }}>

            <Grid size={12} sx={{backgroundColor: 'white', padding: '10px', borderRadius: '10px'}}>
              <Box>
                <Typography variant='h5'>Elim Summarizer</Typography>
              </Box>

              <Box>
                <Typography>Elim Summarizer is an embedded ElimSoul Ai tool that will assist in summarizing notes and texts copied from differnt source.</Typography>
              </Box>
            </Grid>

            <Grid size={12} sx={{backgroundColor: 'white', marginTop: '5px', borderRadius: '5px'}}>
              <Box p={4}>
                <TextField
                  label="Enter text to summarize"
                  multiline
                  rows={8}
                  fullWidth
                  value={input}
                  onChange={(e) => setInput(e.target.value)}/>

                  <Button variant='contained'
                  fullWidth
                  color='primary'
                  sx={{mt: 2}}
                  onClick={handleSummarize}
                  disabled={loading || input.length < 20}>
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Summarize'
                    )}
                  </Button>

                  {error && (
                    <Typography color='error' 
                    sx={{mt: 2}}>
                      {error}
                    </Typography>
                  )}

                  {summary && (
                    <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
                      <Typography variant="subtitle1">Summary:</Typography>
                      <Typography>{summary}</Typography>
                    </Paper>
                  )}
              </Box>
            </Grid>

          </Grid>
     
      </Grid>
      </ProtectedRoute>
    </div>
  );
}