'use client'
import Grid from '@mui/material/Grid'
import ProtectedRoute from '@/components/ProtectedRoute'
import TopNavBar from '@/components/topNavBar'

export default function Academy() {
  return (
    <div >
    <ProtectedRoute>
      <title>Academy Lab | ElimSoul</title>
        <Grid container spacing={2}>
          <Grid size={13}>
          </Grid>
     
      </Grid>
      </ProtectedRoute>
    </div>
  );
}