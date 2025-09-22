import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hunger Games SLP 2025 - Panel del Capitolio',
  description: 'Sistema completo de registro de enfrentamientos en tiempo real para los Hunger Games SLP 2025',
  keywords: ['hunger games', 'capitolio', 'tributos', 'enfrentamientos', 'tiempo real'],
  authors: [{ name: 'Fernando Isaí Hernández González' }],
  openGraph: {
    title: 'Hunger Games SLP 2025 - Panel del Capitolio',
    description: 'Sistema completo de registro de enfrentamientos en tiempo real',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-capitol-bg text-white antialiased font-sans">
        <div className="min-h-screen bg-pattern">
          {children}
        </div>
      </body>
    </html>
  );
}