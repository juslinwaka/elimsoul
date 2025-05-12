'use client'
import Grid from '@mui/material/Grid'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ElimQA() {
  return (
    <div >
    <ProtectedRoute>
      <title>Q&A | ElimSoul</title>
        <Grid container spacing={2}>
          <Grid size={13}>
          </Grid>
     
      </Grid>
      </ProtectedRoute>
    </div>
  );
}