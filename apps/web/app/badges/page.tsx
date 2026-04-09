// ═══════════════════════════════════════════════════════════════
//  IAI Badge System — Explorer Page
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { BadgesExplorer } from './BadgesExplorer'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'IAI App Badges — Reputation and trust system',
  description: 'Hệ thống huy hiệu của app.iai.one cho trust, reputation và lộ trình đóng góp trong cộng đồng IAI.',
  path: '/badges',
  keywords: ['app.iai.one badges', 'badge system', 'reputation', 'trust score'],
})

export default function BadgesPage() {
  return <BadgesExplorer />
}
