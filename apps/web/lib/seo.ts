// ═══════════════════════════════════════════════════════════════
//  IAI Web — SEO Utilities
//  Shared helpers for metadata, JSON-LD, and structured data
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.iai.one'
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.iai.one'

// ── Absolute URL ─────────────────────────────────────────────────
export function absoluteUrl(path: string): string {
  const base = SITE_URL.replace(/\/$/, '')
  const p    = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

// ── JSON-LD serializer ───────────────────────────────────────────
export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data)
}

// ── Text excerpt ─────────────────────────────────────────────────
export function excerpt(text: string | null | undefined, maxLength: number): string {
  if (!text) return ''
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length > maxLength ? clean.slice(0, maxLength - 1) + '…' : clean
}

// ── Fetch SEO JSON (server-side, no auth) ────────────────────────
export async function fetchSeoJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}

// ── Page metadata factory ────────────────────────────────────────
type PageMetadataOptions = {
  title: string
  description: string
  path: string
  type?: 'website' | 'article' | 'profile'
  keywords?: (string | null | undefined)[]
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
  tags?: string[]
}

export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
  keywords,
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path)
  const filteredKeywords = keywords?.filter((k): k is string => typeof k === 'string' && k.length > 0)

  return {
    title,
    description,
    ...(filteredKeywords && filteredKeywords.length > 0 && { keywords: filteredKeywords }),
    alternates: { canonical: url },
    openGraph: {
      type:        type === 'article' ? 'article' : type === 'profile' ? 'profile' : 'website',
      url,
      title,
      description,
      siteName:    'IAI',
      locale:      'vi_VN',
      images:      [{ url: '/opengraph-image', width: 1200, height: 630 }],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors,
        section,
        tags,
      }),
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      ['/opengraph-image'],
    },
  }
}
