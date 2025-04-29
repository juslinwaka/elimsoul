'use client'
import Grid from '@mui/material/Grid'
import {ProtectedRoute} from '@/components/ProtectedRoute'


export default function Dashboard() {
  return (
    <div className='h-fill bg-cover bg-center' >
    <ProtectedRoute/>
      <title>Dashboard | ElimSoul</title>
        <Grid container spacing={2}>
     
      </Grid>
    </div>
  );
}
