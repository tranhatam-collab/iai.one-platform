import type { FlowLocale } from '@/lib/flow-surfaces'

export function FlowFooter({ locale }: { locale: FlowLocale }) {
  const copy = locale === 'vi'
    ? {
        title: 'IAI Flow giu builder shell + templates entry + runtime handoff.',
        description:
          '`flow.iai.one` duoc tach khoi portal va community de giu ro workflow ownership trong pass toi thieu cua PR-08.',
        bottom: 'Flow la workflow product surface. Portal va app giu vai tro rieng.',
      }
    : {
        title: 'IAI Flow keeps builder shell, template entry, and runtime handoff explicit.',
        description:
          '`flow.iai.one` stays separate from portal and community so workflow ownership remains clear in the PR-08 minimum product pass.',
        bottom: 'Flow is the workflow product surface. Portal and app remain separate surfaces.',
      }

  return (
    <footer className="border-t border-white/10 px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-lg font-semibold text-white">{copy.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">{copy.description}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/55">
          <a href="https://iai.one" className="transition hover:text-gold">iai.one</a>
          <a href="https://home.iai.one" className="transition hover:text-gold">home.iai.one</a>
          <a href="https://app.iai.one" className="transition hover:text-gold">app.iai.one</a>
          <a href="https://api.flow.iai.one" className="transition hover:text-gold">api.flow.iai.one</a>
        </div>
        <div className="mt-8 border-t border-white/10 pt-5 text-sm text-white/40">{copy.bottom}</div>
      </div>
    </footer>
  )
}
