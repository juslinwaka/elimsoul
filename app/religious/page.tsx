'use client'
import Grid from '@mui/material/Grid'
import ProtectedRoute from '@/components/ProtectedRoute'
import TopNavBar from '@/components/topNavBar'

export default function Religious() {
  return (
    <div >
    <ProtectedRoute>
      <title>Religious Lab | ElimSoul</title>
        <Grid container spacing={2}>
          <Grid size={13}>
          </Grid>
     
      </Grid>
      </ProtectedRoute>
    </div>
  );
}