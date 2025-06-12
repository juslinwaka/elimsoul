'use client'
import dynamic from "next/dynamic";
import {Grid,
  TextField,
  Paper,
  Typography,
  Box,
  Divider,
  Input,
  Button,
  LinearProgress
} from '@mui/material'
import {useEffect, useState } from 'react';
import mammoth from "mammoth";
import { useScreenConfig } from "@/hooks/screenConfig";
import TranslateToMSL from '@/components/translateToMSL';

const loadPdfJs = async () => {
  const pdfjsLib = await import("pdfjs-dist");
  const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.2.133/pdf.worker.min.js`;

  // Required for v5+
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

  return pdfjsLib;
};


export default function ElimQA() {
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  const [question, setQuestion] = useState("");
  const [document, setDocument] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const {isMobile, isDesktop} = useScreenConfig();

   useEffect(() => {
  const initPdf = async () => {
    try {
      const lib = await loadPdfJs();
      console.log("✅ PDF.js Loaded:", lib);
      setPdfjsLib(lib);
    } catch (err) {
      console.error("❌ Failed to load PDF.js", err);
    }
  };

  initPdf();
}, []);


  const askQuestion = async () =>{
    console.log('Pdf tools loaded successfully.', pdfjsLib);
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const res = await fetch('https://juslin-elim-api.hf.space/ask', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question, document}),
      });

      if (!res.ok) throw new Error('Failed to get an answer.');

      const data = await res.json();
      setResult(data);
      setQuestion('');
    }catch (err: any){
      setError(err.message || 'Unknown error');
    }finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    setFileName(file.name);
    const reader = new FileReader();

    if(file.type === 'application/pdf'){
      reader.onload = async () => {
        const typedarray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({data: typedarray}).promise;
        let text = '';

        for (let i  = 1; i<= pdf.numPages; i++){
          const page = await pdf.getPage(i);
          const Content = await page.getTextContent();
          const strings = Content.items.map((item: any) => item.str);
          text += strings.join(' ') + '\n';
        }
        setDocument(text);
      };
      reader.readAsArrayBuffer(file);
    }else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
      reader.onload = async () =>{
        const result = await mammoth.extractRawText({ arrayBuffer: reader.result as ArrayBuffer});
        setDocument(result.value);
      };
      reader.readAsArrayBuffer(file);
    }
  };

   if (!pdfjsLib) return <div>Loading PDF tools...</div>;

   const clearDocument = () => {
      setDocument('');
      setFileName(null);
  };
  return (
    <Grid container spacing={2} pt={10}>
      {isDesktop&& 
        <Grid size={6}>
          <Box sx={{backgroundColor: 'white'}} >
            <Box sx={{padding: 2,}}>
              <Typography variant="h6" sx={{ mb: 2 }}>📄 Input a Document</Typography>
                  <TextField
                  label="Paste your document here"
                  multiline
                  rows={6}
                  fullWidth
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  sx={{ mb: 3, color: 'black' }} />

                  <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      sx={{ ml: 2 }}
                      onClick={clearDocument}
                      disabled={!document}>
                          Clear Document
                   </Button>
              </Box>

              <Box sx={{margin: 2}}>
                <Input
                    type="file"
                     disabled={!pdfjsLib}
                    inputProps={{
                    accept: '.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    }}
                  onChange={handleFileUpload}/>
                  {fileName && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          File selected: <strong>{fileName}</strong>
                      </Typography>)}
              </Box>
              <Box>
                {document && (
              <Box mt={3}>
                <Typography variant="subtitle2" color="textSecondary">📝 Document Preview:</Typography>
                <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflow: 'auto', backgroundColor: '#f9f9f9' }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{document}</Typography>
                </Paper>
              </Box>
            )}

                 <TextField
                    label="Ask your question"
                    fullWidth
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    sx={{ mb: 2 }}/>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={askQuestion}
                  disabled={loading}>
                    {loading ? "Thinking..." : "Ask ElimSoul"}
                </Button>

                {loading && <LinearProgress sx={{ mt: 2 }} />}

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>)}
              </Box>

              
          </Box>
        </Grid>
      }
      {isDesktop&& 
        <Grid size={6}>
          <Box>
            {result && (
                <Paper elevation={2} sx={{ p: 3, backgroundColor: 'white' }}>
                  <Typography variant="h6" gutterBottom color="secondary">AI Answer</Typography>
                  <Typography><strong>Answer:</strong> {result.answer}</Typography>
                    <Divider sx={{ my: 2 }} />
                  {result.suggestion && (
                  <Typography color="info.main" sx={{ mt: 2 }}><em>Suggestion:</em> {result.suggestion}</Typography>
           )}

           {/*Translate to MSL Button Component*/}
               <TranslateToMSL text={result.answer}/>
          </Paper>
            )}
          </Box>
        </Grid>
      }

       {isMobile&& 
        <Grid size={12}>
          <Box>
            {result && (
                <Paper elevation={2} sx={{ p: 3, backgroundColor: 'white' }}>
                  <Typography variant="h6" gutterBottom color="secondary">AI Answer</Typography>
                  <Typography><strong>Answer:</strong> {result.answer}</Typography>
                    <Divider sx={{ my: 2 }} />
                  {result.suggestion && (
                  <Typography color="info.main" sx={{ mt: 2 }}><em>Suggestion:</em> {result.suggestion}</Typography>
           )}
           {/*Translate to MSL Button Component*/}
               <TranslateToMSL text={result.answer}/>
          </Paper>
            )}
          </Box>
        </Grid>
      }

      {isMobile&& 
        <Grid size={12}>
          <Box sx={{backgroundColor: 'white'}} >
            <Box sx={{padding: 2,}}>
              <Typography variant="h6" sx={{ mb: 2 }}>📄 Input a Document</Typography>
                  <TextField
                  label="Paste your document here"
                  multiline
                  rows={6}
                  fullWidth
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  sx={{ mb: 3, color: 'black' }} />

                  <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      sx={{ ml: 2 }}
                      onClick={clearDocument}
                      disabled={!document}>
                          Clear Document
                   </Button>
              </Box>

              <Box sx={{margin: 2}}>
                <Input
                    type="file"
                     disabled={!pdfjsLib}
                    inputProps={{
                    accept: '.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    }}
                  onChange={handleFileUpload}/>
                  {fileName && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          File selected: <strong>{fileName}</strong>
                      </Typography>)}
              </Box>
              <Box>
                {document && (
              <Box mt={3}>
                <Typography variant="subtitle2" color="textSecondary">📝 Document Preview:</Typography>
                <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflow: 'auto', backgroundColor: '#f9f9f9' }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{document}</Typography>
                </Paper>
              </Box>
            )}

                 <TextField
                    label="Ask your question"
                    fullWidth
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    sx={{ mb: 2 }}/>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={askQuestion}
                  disabled={loading}>
                    {loading ? "Thinking..." : "Ask ElimSoul"}
                </Button>

                {loading && <LinearProgress sx={{ mt: 2 }} />}

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>)}
              </Box>

              
          </Box>
        </Grid>
      }

    </Grid>
  );
}