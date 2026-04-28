import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Insurance Content Generator',
  description: 'Generate 7-day social media content calendars and posts for insurance agents using AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
