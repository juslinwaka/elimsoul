'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useScreenConfig } from '@/hooks/screenConfig';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography
} from '@mui/material';

// ✅ Use the local PDF.js worker from public folder
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

interface PDFViewerProps {
  fileUrl: string;
}

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const {isMobile, isDesktop} = useScreenConfig();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  return (
    <Box>
      {isMobile &&
      <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        padding: 3,
        maxWidth: '100%',
        maxHeight: '90%',
        overflow: 'inherit'
      }}
    >
      <Typography variant="h6" gutterBottom>
        📘 PDF Viewer
      </Typography>

      {loading && <CircularProgress sx={{ marginBottom: 2 }} />}

      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} width={350}/>
      </Document>

      <Grid container justifyContent="space-between" alignItems="center" mt={2}>
        <Button
          onClick={() => setPageNumber((prev) => prev - 1)}
          disabled={pageNumber <= 1}
        >
          ◀ Previous
        </Button>

        <Typography>
          Page {pageNumber} of {numPages}
        </Typography>

        <Button
          onClick={() => setPageNumber((prev) => prev + 1)}
          disabled={pageNumber >= (numPages || 1)}
        >
          Next ▶
        </Button>
      </Grid>
    </Box>}

    {isDesktop&& 
      <Box

      justifyContent='center'
      justifyItems='center'
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        padding: 3,
        maxWidth: '100%',
        maxHeight: '90%',
        overflow: 'inherit'
      }}
    >
      {loading && <CircularProgress sx={{ marginBottom: 2 }} />}

      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} width={1000} height={100} />
      </Document>

      <Grid container justifyContent="space-between" alignItems="center" mt={2}>
        <Button
          onClick={() => setPageNumber((prev) => prev - 1)}
          disabled={pageNumber <= 1}
        >
          ◀ Previous
        </Button>

        <Typography>
          Page {pageNumber} of {numPages}
        </Typography>

        <Button
          onClick={() => setPageNumber((prev) => prev + 1)}
          disabled={pageNumber >= (numPages || 1)}
        >
          Next ▶
        </Button>
      </Grid>
    </Box>
    }
    </Box>
  );
}
