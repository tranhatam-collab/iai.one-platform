import { getFlowTemplateTracks, type FlowLocale } from '@/lib/flow-surfaces'

export function FlowTemplateRail({ locale }: { locale: FlowLocale }) {
  return (
    <section id="template-entry" className="border-t border-white/10 px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-semibold text-white">Template entry</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">
          {locale === 'vi'
            ? 'Flow giu diem vao template packs de team co the bat dau nhanh ma khong tron vai voi portal.'
            : 'Flow keeps template packs as first-class entry points so teams can start quickly without blending portal responsibilities.'}
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {getFlowTemplateTracks(locale).map(track => (
            <article key={track.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="inline-flex rounded-full border border-gold/25 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold">
                {track.readiness}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{track.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">{track.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
