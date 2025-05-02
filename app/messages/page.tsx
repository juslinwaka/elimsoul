'use client'
import Grid from '@mui/material/Grid'
import ProtectedRoute from '@/components/ProtectedRoute'
import TopNavBar from '@/components/topNavBar'
export default function Messages() {
  return (
    <div >
      <title>Messages | ElimSoul</title>
        <Grid container spacing={2}>
          <Grid size={13}>
            <TopNavBar />
          </Grid>
     
      </Grid>
    </div>
  );
}