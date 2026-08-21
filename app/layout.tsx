import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'పద సంపద (Pada Sampada) - Telugu Culture & Dictionary Standardization',
  description: 'A cultural Telugu neologism standardization platform preserving heritage through community democracy, brevity metrics, and open-source data.',
  openGraph: {
    title: 'పద సంపద (Pada Sampada) - Telugu Dictionary Standardization',
    description: 'Community-driven Telugu neologism standardization platform for modern technology and culture.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'పద సంపద (Pada Sampada) - Telugu Dictionary Platform',
    description: 'Empowering Telugu culture with community voting and vocabulary standardization.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
