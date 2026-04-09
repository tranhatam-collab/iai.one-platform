// ═══════════════════════════════════════════════════════════════
//  IAI Lesson Detail Page
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { LessonDetail } from './LessonDetail'
import { absoluteUrl, excerpt, fetchSeoJson, jsonLd, pageMetadata } from '@/lib/seo'

export const runtime = 'edge'

type Props = { params: Promise<{ slug: string }> }
type LessonPayload = {
  slug: string
  title: string
  summary?: string
  subject?: string
  level?: string
  handle?: string
  name?: string
  published_at?: string
  created_at?: string
  fact_score?: number
}
type LessonResponse = { ok: boolean; lesson?: LessonPayload }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await fetchSeoJson<LessonResponse>(`/v1/lessons/${slug}`)
  const lesson = data?.lesson

  if (!lesson) {
    return pageMetadata({
      title: 'Bài học — IAI',
      description: 'Bài học được AI kiểm chứng trên IAI — Intelligence · Artistry · International',
      path: `/lessons/${slug}`,
      type: 'article',
    })
  }

  return pageMetadata({
    title: `${lesson.title} — IAI`,
    description: excerpt(lesson.summary ?? lesson.title, 160),
    path: `/lessons/${lesson.slug}`,
    type: 'article',
    keywords: [lesson.subject, lesson.level, lesson.handle, lesson.fact_score ? `fact score ${lesson.fact_score}` : null],
    publishedTime: lesson.published_at ?? lesson.created_at,
    modifiedTime: lesson.published_at ?? lesson.created_at,
    authors: [lesson.name || `@${lesson.handle ?? 'iai'}`],
    section: 'Lessons',
    tags: [lesson.subject ?? 'education', lesson.level ?? 'all-levels'],
  })
}

export default async function LessonDetailPage({ params }: Props) {
  const { slug } = await params
  const data = await fetchSeoJson<LessonResponse>(`/v1/lessons/${slug}`)
  const lesson = data?.lesson

  const lessonJsonLd = lesson
    ? {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: lesson.title,
        description: excerpt(lesson.summary ?? lesson.title, 160),
        educationalLevel: lesson.level,
        learningResourceType: lesson.subject ?? 'lesson',
        url: absoluteUrl(`/lessons/${lesson.slug}`),
        author: {
          '@type': 'Person',
          name: lesson.name || `@${lesson.handle ?? 'iai'}`,
          url: lesson.handle ? absoluteUrl(`/u/${lesson.handle}`) : undefined,
        },
        publisher: {
          '@type': 'Organization',
          name: 'IAI',
          url: absoluteUrl('/'),
        },
        datePublished: lesson.published_at ?? lesson.created_at,
      }
    : null

  return (
    <>
      {lessonJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(lessonJsonLd) }}
        />
      )}
      <LessonDetail slug={slug} />
    </>
  )
}
