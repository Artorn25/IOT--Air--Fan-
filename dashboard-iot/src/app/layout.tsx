import './globals.css';
import type { Metadata } from 'next';
import { Ubuntu } from 'next/font/google';

const ubuntu = Ubuntu({ subsets: ['latin'], weight: ['400'] });

export const metadata: Metadata = {
  title: 'IoT Fan Healthy',
  description: 'IoT-based air fan system for air quality monitoring',
  icons: {
    icon: '/images/newicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={ubuntu.className}>{children}</body>
    </html>
  );
}