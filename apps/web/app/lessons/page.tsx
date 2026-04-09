// ═══════════════════════════════════════════════════════════════
//  IAI Lessons Page — Knowledge Library
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { LessonsClient } from './LessonsClient'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'IAI App Lessons — Kho bài học cộng đồng',
  description: 'Kho bài học của app.iai.one: học, kiểm chứng, và xây dựng tri thức cộng đồng trong hệ sinh thái IAI.',
  path: '/lessons',
  keywords: ['app.iai.one lessons', 'bài học AI', 'lesson library', 'giáo dục kiểm chứng'],
})

export default function LessonsPage() {
  return <LessonsClient />
}
