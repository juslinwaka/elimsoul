'use client'

import { ThemeProvider } from '@mui/material/styles'
import theme from '@/lib/theme'
import { ToastProvider } from '@/hooks/toast'
import { LoadingProvider } from '@/hooks/loadingspinners'
import TopNavBar from '@/components/topNavBar'
import './globals.css'
import '@/app/src/styles.css'
import { usePathname } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const excludedPaths = ['/', '/signUp', '/gloss', '/signIn','/instructorDashboard']; // You can add more as needed
  const isExcluded = excludedPaths.includes(pathname);

  const Content = (
    <ThemeProvider theme={theme}>
      {!isExcluded && <TopNavBar />}
      {children}
    </ThemeProvider>
  );

  return (
    <html lang="en">
      <body
        className="bg-gradient-blue"
        style={{ backgroundColor: theme.palette.background.default }}
      >
        <ToastProvider>
          <LoadingProvider>
            {isExcluded ? Content : <ProtectedRoute>{Content}</ProtectedRoute>}
          </LoadingProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
