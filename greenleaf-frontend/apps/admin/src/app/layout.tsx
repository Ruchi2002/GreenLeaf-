import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display:  'swap',
});

export const metadata: Metadata = {
  title: 'Greenleaf Admin',
  description: 'Greenleaf administration panel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
