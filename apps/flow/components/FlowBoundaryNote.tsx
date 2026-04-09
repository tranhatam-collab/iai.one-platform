import type { FlowLocale } from '@/lib/flow-surfaces'
import { getFlowBoundaryCopy } from '@/lib/flow-surfaces'

export function FlowBoundaryNote({ locale }: { locale: FlowLocale }) {
  const copy = getFlowBoundaryCopy(locale)

  return (
    <section id="runtime-handoff" className="border-t border-white/10 px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl rounded-3xl border border-gold/25 bg-gold/10 p-8">
        <h2 className="text-2xl font-semibold text-white">{copy.title}</h2>
        <p className="mt-4 text-sm leading-7 text-white/70">{copy.description}</p>
        <ul className="mt-6 space-y-2 text-sm text-white/75">
          {copy.checklist.map(item => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
