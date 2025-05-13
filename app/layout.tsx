'use client'
import {ThemeProvider} from '@mui/material/styles'
import theme from '@/lib/theme'
import {ToastProvider} from '@/hooks/toast';
import { LoadingProvider } from '@/hooks/loadingspinners';
import TopNavBar from '@/components/topNavBar'
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
        <ToastProvider>
          <LoadingProvider>
            <ThemeProvider theme={theme}>
              <TopNavBar />
                {children}
            </ThemeProvider>
          </LoadingProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
