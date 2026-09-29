import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { TopPromotionBanner } from '@/components/layout/TopPromotionBanner';

const sansFont = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const serifFont = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0B2F21',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://sdeventos.com.br'),
  title: {
    default: 'SD Eventos | Buffet para Festas e Eventos em São Paulo',
    template: '%s | SD Eventos',
  },
  description:
    'Buffet a domicílio para aniversários, confraternizações, casamentos e eventos corporativos em São Paulo. Churrasco na brasa, finger foods e massas artesanais.',
  keywords: [
    'buffet a domicílio',
    'churrasco para eventos',
    'finger foods são paulo',
    'festival de massas sp',
    'buffet para casamento',
    'buffet infantil',
    'SD Eventos',
  ],
  authors: [{ name: 'SD Eventos' }],
  creator: 'SD Eventos',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://sdeventos.com.br',
    siteName: 'SD Eventos',
    title: 'SD Eventos | Buffet para Festas e Eventos em São Paulo',
    description:
      'Buffet a domicílio para aniversários, confraternizações, casamentos e eventos corporativos. Simule seu evento e solicite orçamento rápido.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'SD Eventos - Buffet a domicílio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SD Eventos | Buffet a Domicílio',
    description: 'Sabores que encantam. Momentos que ficam.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: 'SD Eventos',
    description: 'Buffet a domicílio e serviços para festas e eventos corporativos e particulares.',
    telephone: '+55 11 98406-6393',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'São Paulo, ABC e Região Metropolitana',
    },
    servesCuisine: 'Buffet brasileiro, Churrasco nobre, Massas artesanais, Finger foods',
    priceRange: '$$',
  };

  return (
    <html lang="pt-BR" className={`${sansFont.variable} ${serifFont.variable} font-sans h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#151D19] selection:bg-[#E0631B] selection:text-white">
        <TopPromotionBanner />
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
