// ═══════════════════════════════════════════════════════════════
//  IAI Platform — Root Layout
//  Intelligence · Artistry · International · iai.one
// ═══════════════════════════════════════════════════════════════

import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { absoluteUrl, jsonLd } from '@/lib/seo'

const LAYOUT_DESCRIPTION =
  'app.iai.one là bề mặt chính cho community, lessons, verify và collaboration trong hệ IAI. iai.one giữ vai trò charter, home.iai.one giữ vai trò portal định tuyến.'

export const metadata: Metadata = {
  metadataBase: new URL('https://app.iai.one'),
  applicationName: 'IAI App',
  title: {
    default: 'IAI App — Intelligence · Artistry · International',
    template: '%s | IAI',
  },
  description: LAYOUT_DESCRIPTION,
  keywords: ['IAI', 'fact-check', 'giáo dục', 'AI', 'blockchain', 'kiểm chứng', 'iai.one'],
  alternates: {
    canonical: 'https://app.iai.one',
  },
  authors: [{ name: 'IAI — Hiệp Hội Trí Tuệ Sáng Tạo Toàn Cầu' }],
  creator: 'IAI',
  category: 'education',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  openGraph: {
    type:        'website',
    locale:      'vi_VN',
    url:         'https://app.iai.one',
    siteName:    'IAI',
    title:       'IAI App — Community · Lessons · Verify · Collaboration',
    description: 'Bề mặt sống của hệ sinh thái IAI cho community, lessons, verify và collaboration.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'IAI App — Community · Lessons · Verify · Collaboration',
    description: 'Bề mặt sống của hệ sinh thái IAI cho community, lessons, verify và collaboration.',
    images:      ['/opengraph-image'],
  },
  icons: {
    icon:  '/icon',
    apple: '/apple-icon',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor:  '#0D0D0F',
  colorScheme: 'dark',
  width:       'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'IAI',
    alternateName: 'IAI V3.0',
    url: absoluteUrl('/'),
    logo: absoluteUrl('/icon'),
    sameAs: [
      'https://home.iai.one',
      'https://app.iai.one',
      'https://flow.iai.one',
      'https://nft.iai.one',
      'https://docs.iai.one',
    ],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'IAI V3.0',
    url: absoluteUrl('/'),
    description: LAYOUT_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: 'IAI',
    },
  }

  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen bg-obsidian text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(websiteJsonLd) }}
        />
        <Navbar />
        <main className="pt-16">
          <div className="border-b border-obsidian-border bg-obsidian-mid/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center gap-3 text-[11px] font-mono text-white/40">
              <span className="badge badge-gold text-[10px]">IAI APP</span>
              <span>Community · Lessons · Verify · Collaboration</span>
              <span className="hidden lg:inline text-white/15">|</span>
              <span>Route map: charter {`->`} iai.one · portal {`->`} home.iai.one · flow {`->`} flow.iai.one</span>
              <a
                href="https://home.iai.one"
                className="text-gold/70 hover:text-gold transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                mở ecosystem portal ↗
              </a>
            </div>
          </div>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
