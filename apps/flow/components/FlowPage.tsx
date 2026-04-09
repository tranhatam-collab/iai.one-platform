import { FlowBoundaryNote } from '@/components/FlowBoundaryNote'
import { FlowEntryGrid } from '@/components/FlowEntryGrid'
import { FlowHandoffPanel } from '@/components/FlowHandoffPanel'
import { FlowHero } from '@/components/FlowHero'
import { FlowTemplateRail } from '@/components/FlowTemplateRail'
import type { FlowLocale } from '@/lib/flow-surfaces'

export function FlowPage({ locale }: { locale: FlowLocale }) {
  return (
    <main>
      <FlowHero locale={locale} />
      <FlowEntryGrid locale={locale} />
      <FlowTemplateRail locale={locale} />
      <FlowHandoffPanel locale={locale} />
      <FlowBoundaryNote locale={locale} />
    </main>
  )
}
