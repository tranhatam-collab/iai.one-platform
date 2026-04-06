// ═══════════════════════════════════════════════════════════════
//  IAI Policies Page — Điều khoản · Bảo mật · Bản quyền
//  Intelligence · Artistry · International · iai.one
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { PoliciesClient } from './PoliciesClient'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'IAI App Policies — Terms, privacy, copyright',
  description: 'Chính sách vận hành của app.iai.one: điều khoản, quyền riêng tư và bản quyền cho cộng đồng IAI.',
  path: '/policies',
  keywords: ['app.iai.one policies', 'điều khoản', 'bảo mật', 'bản quyền'],
})

export default function PoliciesPage() {
  return <PoliciesClient />
}
