import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display:  'swap',
});

export const metadata: Metadata = {
  title: 'Greenleaf — Born for Beauty',
  description: 'Greenleaf member portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
