// ═══════════════════════════════════════════════════════════════
//  IAI Marketplace — Kho Tri Thức
//  Intelligence · Artistry · International · iai.one
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { MarketplaceClient } from './MarketplaceClient'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'IAI App Marketplace — Kho tri thức kiểm chứng',
  description: 'Marketplace của app.iai.one cho khóa học và tài liệu đã qua kiểm chứng, thuộc hệ sinh thái tri thức IAI.',
  path: '/marketplace',
  keywords: ['app.iai.one marketplace', 'marketplace', 'khóa học premium', 'tài liệu giáo dục'],
})

export default function MarketplacePage() {
  return <MarketplaceClient />
}
