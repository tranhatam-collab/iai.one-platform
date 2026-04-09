import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { FlowFooter } from '@/components/FlowFooter'
import { FlowNav } from '@/components/FlowNav'

export const metadata: Metadata = {
  metadataBase: new URL('https://flow.iai.one'),
  title: {
    default: 'IAI Flow',
    template: '%s | IAI Flow',
  },
  description: 'Canonical workflow builder, templates entry, and runtime handoff surface for the IAI ecosystem.',
  alternates: {
    canonical: 'https://flow.iai.one',
    languages: {
      en: 'https://flow.iai.one',
      vi: 'https://flow.iai.one/vi/',
    },
  },
  openGraph: {
    title: 'IAI Flow',
    description: 'Canonical workflow builder, templates entry, and runtime handoff surface for the IAI ecosystem.',
    url: 'https://flow.iai.one',
    siteName: 'IAI Flow',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-obsidian text-white antialiased">
        <FlowNav locale="en" />
        {children}
        <FlowFooter locale="en" />
      </body>
    </html>
  )
}
