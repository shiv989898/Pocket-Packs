import type {Metadata} from 'next';
import './globals.css';
import { UserProvider } from '@/contexts/user-provider';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Pocket Packs',
  description: 'Open Pokémon card packs and manage your collection.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Russo+One&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <UserProvider>
          {children}
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
