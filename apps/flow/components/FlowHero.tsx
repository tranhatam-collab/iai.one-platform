import type { FlowLocale } from '@/lib/flow-surfaces'
import { getFlowHeroCopy } from '@/lib/flow-surfaces'

export function FlowHero({ locale }: { locale: FlowLocale }) {
  const copy = getFlowHeroCopy(locale)

  return (
    <section className="border-b border-white/10 px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan">flow.iai.one</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {copy.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
          {copy.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#builder-shell"
            className="rounded-xl bg-cyan px-5 py-3 text-sm font-medium text-black transition hover:brightness-110"
          >
            {copy.primaryCta}
          </a>
          <a
            href="#template-entry"
            className="rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white"
          >
            {copy.secondaryCta}
          </a>
        </div>
      </div>
    </section>
  )
}
