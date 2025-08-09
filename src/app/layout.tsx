// src/app/layout.tsx
import './globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { SpeedInsights } from "@vercel/speed-insights/next"

config.autoAddCss = false; // Tell FontAwesome to skip adding CSS (avoids duplicate)
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saurabh Jadhav | Portfolio',
  description: 'Software Developer • Python • React • Full-Stack',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
