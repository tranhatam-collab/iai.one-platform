// ═══════════════════════════════════════════════════════════════
//  IAI Studio — AI Content Creation Studio
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { StudioClient } from './StudioClient'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'IAI App Studio — Creator and operations surface',
  description: 'Studio của app.iai.one cho creator và ops: tạo nội dung, kiểm chứng, cộng tác và điều phối surface trong hệ IAI.',
  path: '/studio',
  keywords: ['app.iai.one studio', 'IAI Studio', 'automation', 'creator tools'],
})

export default function StudioPage() {
  return <StudioClient />
}
