'use client'
import {ThemeProvider} from '@mui/material/styles'
import theme from '@/lib/theme'
import {ToastProvider} from '@/hooks/toast';
import { LoadingProvider } from '@/hooks/loadingspinners';
import TopNavBar from '@/components/topNavBar'
import "./globals.css";
import '@/app/src/styles.css';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const hideNavBar = pathname === '/' || pathname === '/signUp';

  return (
    <html lang="en">
      <body className='bg-gradient-blue'
       style={{backgroundColor: theme.palette.background.default}}>
        <ToastProvider>
          <LoadingProvider>
            <ThemeProvider theme={theme}>
              {!hideNavBar && <TopNavBar />}
                {children}
            </ThemeProvider>
          </LoadingProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
