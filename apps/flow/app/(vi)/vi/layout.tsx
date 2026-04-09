import type { Metadata } from 'next'
import '../../globals.css'
import { FlowFooter } from '@/components/FlowFooter'
import { FlowNav } from '@/components/FlowNav'

export const metadata: Metadata = {
  metadataBase: new URL('https://flow.iai.one'),
  title: {
    default: 'IAI Flow - Tieng Viet',
    template: '%s | IAI Flow',
  },
  description: 'Be mat workflow builder, templates entry, va runtime handoff chinh thuc cho he sinh thai IAI.',
  alternates: {
    canonical: 'https://flow.iai.one/vi/',
    languages: {
      en: 'https://flow.iai.one',
      vi: 'https://flow.iai.one/vi/',
    },
  },
  openGraph: {
    title: 'IAI Flow - Tieng Viet',
    description: 'Be mat workflow builder, templates entry, va runtime handoff chinh thuc cho he sinh thai IAI.',
    url: 'https://flow.iai.one/vi/',
    siteName: 'IAI Flow',
    locale: 'vi_VN',
    type: 'website',
  },
}

export default function VietnameseFlowLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-obsidian text-white antialiased">
        <FlowNav locale="vi" />
        {children}
        <FlowFooter locale="vi" />
      </body>
    </html>
  )
}
