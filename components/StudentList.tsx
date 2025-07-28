// components/instructor/StudentList.tsx
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';

interface Student {
  uid: string;
  name: string;
  email: string;
  xp?: number;
  streak?: number;
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      const studentCol = collection(db, 'students');
      const snapshot = await getDocs(studentCol);
      const data: Student[] = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as Student[];
      setStudents(data);
      setLoading(false);
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) =>
    s.name?.toLowerCase().includes(filter.toLowerCase()) ||
    s.email?.toLowerCase().includes(filter.toLowerCase()) ||
    s.uid.includes(filter)
  );

  return (
    <Paper sx={{ color:'white', backgroundColor: 'rgba(02, 205, 255, 0.6)', width: '95%', padding: 3, marginTop: 2 }}>
      <Typography variant="h5" gutterBottom>
        👩‍🏫 Student List
      </Typography>

      <TextField
        fullWidth
        label="Search by name, email, or ID"
        variant="outlined"
        sx={{ my: 2, color:'white' }}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>XP</TableCell>
              <TableCell>Streak</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.uid}>
                <TableCell>{student.name || 'N/A'}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.xp || 0}</TableCell>
                <TableCell>{student.streak || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
