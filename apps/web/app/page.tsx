// ═══════════════════════════════════════════════════════════════
//  IAI Homepage — Social Feed
//  Intelligence · Artistry · International · iai.one
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { FeedPage } from './FeedPage'
import { absoluteUrl, jsonLd, pageMetadata } from '@/lib/seo'

const HOME_DESCRIPTION =
  'app.iai.one là bề mặt sống của hệ sinh thái IAI cho community, lessons, verify và collaboration. home.iai.one là portal định tuyến, iai.one là charter gốc.'

export const metadata: Metadata = pageMetadata({
  title: 'IAI App — Community, lessons, verify, collaboration',
  description: HOME_DESCRIPTION,
  path: '/',
  keywords: ['app.iai.one', 'community feed', 'social learning', 'verification', 'ecosystem portal'],
})

export default function HomePage() {
  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'IAI V3.0',
    url: absoluteUrl('/'),
    description: HOME_DESCRIPTION,
    isPartOf: absoluteUrl('/'),
    about: ['Community', 'Lessons', 'Verification', 'Collaboration'],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(homeJsonLd) }}
      />
      <FeedPage />
    </>
  )
}
