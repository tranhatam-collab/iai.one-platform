import { getFlowHandoffLinks, type FlowLocale } from '@/lib/flow-surfaces'

export function FlowHandoffPanel({ locale }: { locale: FlowLocale }) {
  return (
    <section className="border-t border-white/10 px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl rounded-3xl border border-cyan/20 bg-cyan/5 p-8">
        <h2 className="text-2xl font-semibold text-white">Handoff map</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">
          {locale === 'vi'
            ? 'Flow canh tranh ro vai tro voi portal, app, va API ownership de khong bi tron role khi scale.'
            : 'Flow keeps explicit handoff boundaries with portal, app, and API ownership so role drift does not happen during scale.'}
        </p>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {getFlowHandoffLinks(locale).map(link => (
            <article key={link.title} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="text-base font-semibold text-white">{link.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">{link.description}</p>
              <a
                href={link.href}
                className="mt-4 inline-flex rounded-lg border border-white/20 px-3 py-2 text-sm text-white/85 transition hover:border-white/40 hover:text-white"
              >
                {link.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
