// ═══════════════════════════════════════════════════════════════
//  IAI Web — SEO Utilities
//  Metadata, JSON-LD, and Open Graph helpers
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.iai.one'

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://api.iai.one'

// ── Helpers ──────────────────────────────────────────────────────

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path: string): string {
  const base = SITE_URL.replace(/\/$/, '')
  const normalised = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalised}`
}

/**
 * Serialize a JSON-LD object to a string safe for dangerouslySetInnerHTML.
 * Escapes HTML-special characters to prevent XSS via script-tag injection.
 */
export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/&/g, '\\u0026')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/** Truncate text to at most `maxLength` characters, appending "…" if cut. */
export function excerpt(
  text: string | null | undefined,
  maxLength: number,
): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1)}…`
}

// ── pageMetadata options ─────────────────────────────────────────

export interface PageMetadataOptions {
  title: string
  description: string
  path: string
  keywords?: (string | null | undefined)[]
  /** OG type — defaults to 'website' */
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
  tags?: string[]
}

/** Generate a Next.js Metadata object with OG, Twitter and canonical fields. */
export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path)
  const filteredKeywords = keywords.filter(Boolean) as string[]

  const metadata: Metadata = {
    title,
    description,
    ...(filteredKeywords.length > 0 && { keywords: filteredKeywords }),
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: 'IAI',
      locale: 'vi_VN',
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors,
        section,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
  }

  return metadata
}

// ── fetchSeoJson ─────────────────────────────────────────────────

/**
 * Fetch JSON from the IAI API for SEO / metadata generation.
 * Returns `null` on any error so callers can fall back gracefully.
 */
export async function fetchSeoJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`)
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}
