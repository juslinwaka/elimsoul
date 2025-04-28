'use client';

import { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const ToastContext = createContext<any>(null);

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const showToast = (msg: string, level: 'success' | 'error' | 'info' | 'warning') => {
    setMessage(msg);
    setSeverity(level);
    setOpen(true);
  };

  const Toast = () => (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={() => setOpen(false)} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast /> 
    </ToastContext.Provider>
  );
};
