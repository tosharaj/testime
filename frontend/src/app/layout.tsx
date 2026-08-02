import type { Metadata } from 'next';
import { Inter, Fredoka } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Testime - Premium Exam Preparation Platform',
  description: 'India\'s most advanced exam preparation platform. Access curated study notes, practice with 25,000+ questions, and take realistic mock tests for SSC, Banking, Railways, UPSC and more.',
  keywords: 'exam preparation, study notes, mock tests, question bank, SSC, banking, UPSC, railways',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${fredoka.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
