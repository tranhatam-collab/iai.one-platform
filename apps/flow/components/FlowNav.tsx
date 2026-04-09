'use client'

import type { FlowLocale } from '@/lib/flow-surfaces'

const links = {
  en: [
    { label: 'Charter', href: 'https://iai.one' },
    { label: 'Portal', href: 'https://home.iai.one' },
    { label: 'App', href: 'https://app.iai.one' },
  ],
  vi: [
    { label: 'Charter', href: 'https://iai.one/vi/' },
    { label: 'Portal', href: 'https://home.iai.one/vi/' },
    { label: 'App', href: 'https://app.iai.one' },
  ],
}

export function FlowNav({ locale }: { locale: FlowLocale }) {
  const copy = locale === 'vi'
    ? {
        brandHref: 'https://flow.iai.one/vi/',
        languageHref: '/',
        languageLabel: 'EN',
        ctaHref: '/vi/#builder-shell',
        cta: 'Mo builder shell',
      }
    : {
        brandHref: 'https://flow.iai.one',
        languageHref: '/vi/',
        languageLabel: 'VI',
        ctaHref: '/#builder-shell',
        cta: 'Open builder shell',
      }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-obsidian/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 sm:px-10 lg:px-16">
        <a href={copy.brandHref} className="text-sm font-semibold uppercase tracking-[0.3em] text-white">
          IAI Flow
        </a>
        <nav className="flex items-center gap-3 sm:gap-5">
          {links[locale].map(link => (
            <a key={link.label} href={link.href} className="hidden text-sm text-white/65 transition hover:text-white sm:inline">
              {link.label}
            </a>
          ))}
          <a
            href={copy.languageHref}
            className="rounded-xl border border-white/15 px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white/75 transition hover:border-gold/40 hover:text-white"
          >
            {copy.languageLabel}
          </a>
          <a
            href={copy.ctaHref}
            className="rounded-xl bg-gold px-4 py-2 text-sm font-medium text-black transition hover:brightness-110"
          >
            {copy.cta}
          </a>
        </nav>
      </div>
    </header>
  )
}
