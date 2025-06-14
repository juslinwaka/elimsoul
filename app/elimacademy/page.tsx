'use client'
import Grid from '@mui/material/Grid'
import PDFViewer from '@/components/pdfViewer';

export default function Academy() {
  return (
    <Grid container spacing={2} justifyContent='center' alignItems='center'>
      <title>Academy Lab | ElimSoul</title>
      <Grid size={12} pt={10}>
        <PDFViewer fileUrl="/docs/Alphabets.pdf" />
      </Grid>
    </Grid>
  );
}