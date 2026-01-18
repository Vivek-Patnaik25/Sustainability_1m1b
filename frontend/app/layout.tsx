import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI-Powered Local Sustainability Issue Analyzer',
  description: 'Identify and classify local sustainability issues using AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900 antialiased`} suppressHydrationWarning={true}>
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 mt-12 py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© 2026 1M1B IBM SkillsBuild Internship Project. Created for Educational Purposes.</p>
            <p className="mt-2">Strictly aligned with UN SDGs 11, 6, 12, 13.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
