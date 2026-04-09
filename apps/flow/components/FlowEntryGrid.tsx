import { getFlowEntryPoints, type FlowLocale } from '@/lib/flow-surfaces'

export function FlowEntryGrid({ locale }: { locale: FlowLocale }) {
  return (
    <section id="builder-shell" className="px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
        {getFlowEntryPoints(locale).map(point => (
          <div key={point.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 inline-flex rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
              {point.status}
            </div>
            <h2 className="text-lg font-semibold text-white">{point.title}</h2>
            <p className="mt-3 min-h-[72px] text-sm leading-6 text-white/65">{point.description}</p>
            <a
              href={point.href}
              className="mt-5 inline-flex rounded-xl border border-cyan/40 px-4 py-2 text-sm font-medium text-cyan transition hover:border-cyan hover:text-white"
            >
              {point.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
