'use client'
import Grid from '@mui/material/Grid'
import ProtectedRoute from '@/components/ProtectedRoute'
import TopNavBar from '@/components/topNavBar'


export default function Settings() {
  return (
    <div >
    <ProtectedRoute>
      <title>Settings | ElimSoul</title>
        <Grid container spacing={2}>
          <Grid size={12}>
          </Grid>
     
      </Grid>
      </ProtectedRoute>
    </div>
  );
}