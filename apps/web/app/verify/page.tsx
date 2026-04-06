// ═══════════════════════════════════════════════════════════════
//  IAI Verify Page — AI Fact-Check Interface
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { VerifyClient } from './VerifyClient'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'IAI App Verify — Kiểm chứng nội dung cộng đồng',
  description: 'IAI Verify trên app.iai.one: kiểm chứng bài viết, luận điểm và bằng chứng trước khi lan truyền công khai.',
  path: '/verify',
  keywords: ['app.iai.one verify', 'fact-check AI', 'verify', 'Claude AI'],
})

export default function VerifyPage() {
  return <VerifyClient />
}
