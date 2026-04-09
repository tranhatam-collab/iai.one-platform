export type FlowLocale = 'en' | 'vi'

type FlowHeroCopy = {
  title: string
  description: string
  primaryCta: string
  secondaryCta: string
}

type FlowEntryPoint = {
  title: string
  description: string
  href: string
  cta: string
  status: 'now' | 'next'
}

type FlowTemplateTrack = {
  title: string
  description: string
  readiness: string
}

type FlowHandoffLink = {
  title: string
  description: string
  href: string
  cta: string
}

type FlowBoundaryCopy = {
  title: string
  description: string
  checklist: string[]
}

export function getFlowHeroCopy(locale: FlowLocale): FlowHeroCopy {
  if (locale === 'vi') {
    return {
      title: 'Builder shell, templates entry, va runtime handoff cho workflow team.',
      description:
        'Flow giu vai tro product surface cho flow building. Portal dinh huong duong vao, app giu community usage, flow giu builder va orchestration identity.',
      primaryCta: 'Mo builder shell',
      secondaryCta: 'Xem templates entry',
    }
  }

  return {
    title: 'Builder shell, templates entry, and runtime handoff for workflow teams.',
    description:
      'Flow is the product surface for flow building. Portal handles orientation, app handles community usage, and flow keeps builder and orchestration identity clear.',
    primaryCta: 'Open builder shell',
    secondaryCta: 'Browse template entry',
  }
}

export function getFlowEntryPoints(locale: FlowLocale): FlowEntryPoint[] {
  if (locale === 'vi') {
    return [
      {
        title: 'Builder shell',
        description: 'Diem vao chinh cho workflow builder, runbook, va execution controls.',
        href: '#builder-shell',
        cta: 'Vao builder shell',
        status: 'now',
      },
      {
        title: 'Template entry',
        description: 'Diem vao cho starter templates, bo mau team handoff, va common automations.',
        href: '#template-entry',
        cta: 'Xem template packs',
        status: 'now',
      },
      {
        title: 'Runtime handoff',
        description: 'Lop ban giao giua flow surface, app destination, va api boundary.',
        href: '#runtime-handoff',
        cta: 'Mo handoff map',
        status: 'next',
      },
    ]
  }

  return [
    {
      title: 'Builder shell',
      description: 'Primary entry for workflow builder controls, runbooks, and execution guidance.',
      href: '#builder-shell',
      cta: 'Enter builder shell',
      status: 'now',
    },
    {
      title: 'Template entry',
      description: 'Entry path for starter templates, team handoff packs, and common automations.',
      href: '#template-entry',
      cta: 'Open template packs',
      status: 'now',
    },
    {
      title: 'Runtime handoff',
      description: 'Boundary layer between flow surface, app destination, and API runtime ownership.',
      href: '#runtime-handoff',
      cta: 'View handoff map',
      status: 'next',
    },
  ]
}

export function getFlowTemplateTracks(locale: FlowLocale): FlowTemplateTrack[] {
  if (locale === 'vi') {
    return [
      {
        title: 'Daily check-in',
        description: 'Mau workflow cho team sync, blocker routing, va decision capture.',
        readiness: 'Ready now',
      },
      {
        title: 'Content release',
        description: 'Mau publish flow cho content, verification, va release handoff.',
        readiness: 'Ready now',
      },
      {
        title: 'Migration control',
        description: 'Mau import wave control cho manifest, dry-run, va sign-off gate.',
        readiness: 'Next pass',
      },
    ]
  }

  return [
    {
      title: 'Daily check-in',
      description: 'Workflow template for team sync, blocker routing, and decision capture.',
      readiness: 'Ready now',
    },
    {
      title: 'Content release',
      description: 'Workflow template for content publishing, verification, and release handoff.',
      readiness: 'Ready now',
    },
    {
      title: 'Migration control',
      description: 'Workflow template for manifest import waves, dry-runs, and sign-off gates.',
      readiness: 'Next pass',
    },
  ]
}

export function getFlowHandoffLinks(locale: FlowLocale): FlowHandoffLink[] {
  if (locale === 'vi') {
    return [
      {
        title: 'Portal handoff',
        description: 'Chuyen tu portal vao flow khi user can workflow build path ro rang.',
        href: 'https://home.iai.one/vi/',
        cta: 'Mo home portal',
      },
      {
        title: 'App destination',
        description: 'Chuyen tu flow sang app khi can community/product destination.',
        href: 'https://app.iai.one',
        cta: 'Mo app surface',
      },
      {
        title: 'API boundary',
        description: 'Boundary cho runtime endpoint ownership giua api.iai.one va api.flow.',
        href: 'https://api.iai.one/health',
        cta: 'Xem api boundary',
      },
    ]
  }

  return [
    {
      title: 'Portal handoff',
      description: 'Route from portal into flow when users need a clear workflow build path.',
      href: 'https://home.iai.one',
      cta: 'Open home portal',
    },
    {
      title: 'App destination',
      description: 'Route from flow to app when users need community or product destinations.',
      href: 'https://app.iai.one',
      cta: 'Open app surface',
    },
    {
      title: 'API boundary',
      description: 'Runtime endpoint boundary between api.iai.one and the future api.flow surface.',
      href: 'https://api.iai.one/health',
      cta: 'View API boundary',
    },
  ]
}

export function getFlowBoundaryCopy(locale: FlowLocale): FlowBoundaryCopy {
  if (locale === 'vi') {
    return {
      title: 'Boundary va ownership',
      description:
        '`flow.iai.one` la workflow product surface. Portal khong bi nhap vao flow, va community destination khong bi keo ve flow.',
      checklist: [
        'Flow giu builder shell va templates entry.',
        'Portal giu ecosystem orientation.',
        'App giu community va product destination.',
      ],
    }
  }

  return {
    title: 'Boundary and ownership',
    description:
      '`flow.iai.one` is the workflow product surface. Portal is not merged into flow, and community destinations are not pulled into flow.',
    checklist: [
      'Flow owns builder shell and template entry.',
      'Portal owns ecosystem orientation.',
      'App owns community and product destinations.',
    ],
  }
}
