'use client'
import { Box, Typography, TextField, RadioGroup, Radio, FormControlLabel, Button } from '@mui/material';
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {auth, db} from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore'

export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("Kid");
  const [faith, setFaith] = useState("Christian")

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), 
    {uid: user.uid,
      name,
      email,
      role,
      faith,
    });

    router.push('/dashboard');
    }catch (error){
      console.error("Error Signing Up: ", error);
      alert(error)
    }
  }

  return (
    <div className='h-fill bg-cover bg-center' >
      <title>Sign Up | ElimSoul</title>
        <Grid container spacing={2}>
          <Grid size={9}>
            <Box sx={{maxWidth: 400, mx: 'auto', mt: 5, p: 2}}>
              <Typography color='secondary' variant='h4' align='center' gutterBottom>
                Create an Account
              </Typography>

            <TextField label='FullName'
              fullWidth
              margin='normal'
              value={name}
              onChange={(e) => setName(e.target.value)}/>

            <TextField label='Email'
              fullWidth
              margin='normal'
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>

            <TextField label='Password'
              fullWidth
              type='password'
              margin='normal'
              value={password}
              onChange={(e) => setPassword(e.target.value)}/>

              <Typography color='secondary' variant='subtitle1' mt={2}>Select Role: </Typography>

              <RadioGroup value={faith} onChange={(e) => setFaith(e.target.value)}>
                <FormControlLabel value='Christian' control={<Radio/>} label='Christian'/>
                <FormControlLabel value='Muslim' control={<Radio/>} label='Muslim'/>
              </RadioGroup>

              <Button variant='contained' fullWidth sx={{mt: 3}} onClick={handleSignUp}>Sign Up</Button>

            </Box>
          </Grid>
     
      </Grid>
    </div>
  );
}
