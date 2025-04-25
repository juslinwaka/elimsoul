'use client'

import {ThemeProvider} from '@mui/material/styles'
import theme from '@/lib/theme'
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
       style={{backgroundColor: theme.palette.background.default}}>
        <ThemeProvider theme={theme}>
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
