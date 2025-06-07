'use client'
import {Grid,
   Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  TextField} from '@mui/material'
import ProtectedRoute from '@/components/ProtectedRoute'
import React, {useState} from 'react'
import { useToast } from '@/hooks/toast';
import glossMap from '@/data/gloss_to_video-placeholder.json' assert {type: 'json'};


export default function GLOSS() {
  const [input, setInput] = useState('')
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [gloss, setGloss] = useState('')
  const [glossWords, setGlossWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const {showToast, Toast} = useToast();
  const [videoPath, setVideoPath] = useState<string[]>([]);

  const handleReporting = async () => {
    if (!name || !email || !title || !desc) {
        showToast("Please fill all fields", "error");
        return;
    }
    const msg = `
🔔      GLOSS ISSUE REPORT
        Name: ${name}
        Email: ${email}
        Title: ${title}
        Description: ${desc}
        Gloss Output: ${gloss || 'N/A'}`;

    const encoded = encodeURIComponent(msg);
    const whatsappURL = `https://wa.me/265999636142?text=${encoded}`;

    window.open(whatsappURL, "_blank");
  }

  const handleSummarize = async () => {
    setLoading(true);
    setError('');
    setGloss('');

    try{
      const response = await fetch('https://juslin-elim-api.hf.space/gloss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) {
          const errorText = await response.text();
          console.error("API error:", errorText);
          setError(`Failed to translate text: ${errorText}`);
          throw new Error(`API error: ${errorText}`);
      }

      const data = await response.json();
      setGloss(data.gloss);

      const words = data.gloss.trim().split(" ");
      setGlossWords(words);

      const videoMap: Record<string, string> = glossMap;

      const videos = words
        .map((word: string) => {
          const clip = videoMap[word.toUpperCase()];

          if (!clip) console.warn(`No video found for gloss: ${word}`);
          return clip;
        })
        .filter(Boolean);

      setVideoPath(videos);
      setInput(''); // Clear input after successful translation
      }catch{
        setError('Failed to translate text');
        showToast("Failed to translate text", "error");
      }finally{
        setLoading(false);
      }
  };



  return (
    <main className="p-6 bg-gradient-blue"  >
      <title> MSL Project | ElimSoul</title>
        <Grid container spacing={2} >
          <Grid size={12} sx={{
            '& .MuiDrawer-paper': {
              backgroundColor: 'white', // or use `#fff`
            },
          }}>

            <Grid size={12} sx={{backgroundColor: 'white', padding: '10px', borderRadius: '10px'}}>
              <Box>
                <Typography pt={7} variant='h5'>ElimSoul MSL Project</Typography>
              </Box>

              <Box>
                <Typography>ElimSoul MSL project is a multi-modal AI tool that will assist in translating
                     text into gloss. For more info about the project, reach us through +265 999 636 142.</Typography>
              </Box>
            </Grid>

            <Grid size={12} sx={{backgroundColor: 'white', marginTop: '5px', borderRadius: '5px'}}>
              <Box p={4}>
                <TextField
                  label="Enter text to translate to gloss..."
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
                  disabled={loading || !input.trim()}>
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Translate to Gloss'
                    )}
                  </Button>

                  {error && (
                    <Typography color='error' 
                    sx={{mt: 2}}>
                      {error}
                    </Typography>
                  )}

                  {gloss && (
                    <Paper elevation={3} sx={{ backgroundColor: 'white', mt: 4, p: 2 }}>
                        <Typography fontWeight='600' variant="subtitle1">Gloss:</Typography>
                        <Typography fontWeight='500' variant="subtitle1">{gloss}</Typography>
                        <Typography fontWeight='500' variant="subtitle1">{glossWords}</Typography>

                        {videoPath.length > 0 && (
                          <Box mt={2}>
                            <Typography fontWeight='600' variant='subtitle1'> Sign Clips</Typography>
                            <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                              {videoPath.map((src, i) => (
                                <video key={i} src={src} controls width='200' style={{ marginRight: 8, marginBottom: 8 }} />
                              ))}
                            </Box>
                          </Box>
                        )}

                        <TextField label="Your Name" fullWidth sx={{mt: 2}} value={name} onChange={e => setName(e.target.value)} />
                        <TextField label="Your Email" fullWidth sx={{mt: 2}} value={email} onChange={e => setEmail(e.target.value)} />
                        <TextField label="Issue Title" fullWidth sx={{mt: 2}} value={title} onChange={e => setTitle(e.target.value)} />
                        <TextField label="Description" multiline rows={4} fullWidth sx={{mt: 2}} value={desc} onChange={e => setDesc(e.target.value)} />

                    <Button variant='outlined'
                        fullWidth
                        sx={{margin: 2}}
                        onClick={handleReporting}>Report Fault</Button>
                    </Paper>
                  )}
              </Box>
            </Grid>

          </Grid>
     
      </Grid>
    </main>
  );
}