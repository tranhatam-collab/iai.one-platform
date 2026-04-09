import { json } from '../lib/cors'
import type { Bindings, LegacySourceSystem } from '../types'

type LegacyUserImportStatus = 'linked' | 'pending_review' | 'blocked'
type LegacyContentImportStatus = 'pending' | 'imported' | 'rejected' | 'needs_review'
type LegacyModerationStatus = 'pending' | 'approved' | 'flagged'
type LegacyContentType = 'post' | 'lesson' | 'document' | 'asset'

const MIGRATION_CONTRACT_VERSION = '2026-04-09-pr06'

function isAdmin(request: Request, env: Bindings): boolean {
  const auth = request.headers.get('Authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  const headerSecret = request.headers.get('x-iai-admin-secret') || token
  return Boolean(env.IAI_ADMIN_SECRET && headerSecret === env.IAI_ADMIN_SECRET)
}

function debugEnabled(env: Bindings): boolean {
  const mode = (env.IAI_ENV || '').toLowerCase()
  return mode !== 'production' || Boolean(env.APP_URL?.includes('preview'))
}

function parseLimit(value: string | null, fallback = 50, cap = 200): number {
  const parsed = Number.parseInt(value ?? String(fallback), 10)
  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) return fallback
  return Math.max(1, Math.min(parsed, cap))
}

async function findLegacyUser(
  env: Bindings,
  sourceSystem: LegacySourceSystem,
  sourceUserId?: string,
  sourceHandle?: string,
) {
  if (sourceUserId) {
    return env.DB.prepare(
      'SELECT id, user_id, source_system, source_user_id, source_handle, source_email, source_url, import_status, linked_at, updated_at FROM legacy_user_links WHERE source_system = ? AND source_user_id = ? LIMIT 1'
    ).bind(sourceSystem, sourceUserId).first()
  }
  if (sourceHandle) {
    return env.DB.prepare(
      'SELECT id, user_id, source_system, source_user_id, source_handle, source_email, source_url, import_status, linked_at, updated_at FROM legacy_user_links WHERE source_system = ? AND source_handle = ? LIMIT 1'
    ).bind(sourceSystem, sourceHandle).first()
  }
  return null
}

async function writeMigrationAudit(
  env: Bindings,
  input: {
    operation: string
    sourceSystem?: string | null
    sourceRef?: string | null
    actorRef?: string | null
    dryRun?: boolean
    status: 'success' | 'rejected' | 'failed'
    detail?: unknown
  },
): Promise<void> {
  try {
    await env.DB.prepare(`
      INSERT INTO migration_audit_events (
        id, operation, source_system, source_ref, actor_ref, dry_run, status, detail_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      crypto.randomUUID(),
      input.operation,
      input.sourceSystem ?? null,
      input.sourceRef ?? null,
      input.actorRef ?? null,
      input.dryRun ? 1 : 0,
      input.status,
      input.detail ? JSON.stringify(input.detail) : null,
    ).run()
  } catch {
    // Best-effort audit write. We do not fail migration operations if the audit table is not ready yet.
  }
}

export async function handleMigration(request: Request, env: Bindings, path: string): Promise<Response> {
  const origin = request.headers.get('Origin')
  const J = (d: unknown, s = 200) => json(d, s, origin, env.ALLOWED_ORIGINS)

  if (!path.startsWith('/v1/migration/')) {
    return J({ ok: false, error: 'Not found' }, 404)
  }

  if (path === '/v1/migration/health' && request.method === 'GET') {
    const links = await env.DB.prepare('SELECT COUNT(*) as count FROM legacy_user_links').first<{ count: number }>()
    const imports = await env.DB.prepare('SELECT COUNT(*) as count FROM legacy_content_imports').first<{ count: number }>()
    const audits = await env.DB.prepare('SELECT COUNT(*) as count FROM migration_audit_events').first<{ count: number }>()
    const admin = isAdmin(request, env)

    if (!admin) {
      return J({
        ok: false,
        error: 'Forbidden',
        migration: {
          ready: true,
          adminConfigured: Boolean(env.IAI_ADMIN_SECRET),
          authAccepted: ['x-iai-admin-secret', 'Authorization: Bearer <IAI_ADMIN_SECRET>'],
          debug: debugEnabled(env),
        },
      }, 403)
    }

    return J({
      ok: true,
      legacy_user_links: links?.count ?? 0,
      legacy_content_imports: imports?.count ?? 0,
      migration_audit_events: audits?.count ?? 0,
      mode: 'wave1',
      auth: {
        method: request.headers.get('x-iai-admin-secret') ? 'x-iai-admin-secret' : 'authorization-bearer',
        debug: debugEnabled(env),
      },
    })
  }

  if (path === '/v1/migration/contracts' && request.method === 'GET') {
    const admin = isAdmin(request, env)
    return J({
      ok: true,
      version: MIGRATION_CONTRACT_VERSION,
      mode: 'wave1',
      auth: {
        adminRequired: true,
        accepted: ['x-iai-admin-secret', 'Authorization: Bearer <IAI_ADMIN_SECRET>'],
        adminConfigured: Boolean(env.IAI_ADMIN_SECRET),
        debug: debugEnabled(env),
      },
      routes: [
        'GET  /v1/migration/health',
        'GET  /v1/migration/contracts',
        'GET  /v1/migration/legacy-users',
        'POST /v1/migration/legacy-users',
        'POST /v1/migration/legacy-users/upsert',
        'GET  /v1/migration/legacy-content',
        'POST /v1/migration/legacy-content',
        'POST /v1/migration/legacy-content/upsert',
        'POST /v1/migration/legacy-content/mark-imported',
        'POST /v1/migration/legacy-content/mark-imported-by-source',
        'GET  /v1/migration/audit-events',
      ],
      idempotent: [
        'POST /v1/migration/legacy-users/upsert',
        'POST /v1/migration/legacy-content/upsert',
        'POST /v1/migration/legacy-content/mark-imported-by-source',
      ],
      dryRunSupported: [
        'POST /v1/migration/legacy-users/upsert',
        'POST /v1/migration/legacy-content/upsert',
      ],
      admin: {
        authenticated: admin,
      },
    })
  }

  if (!isAdmin(request, env)) {
    return J({ ok: false, error: 'Forbidden' }, 403)
  }

  if (path === '/v1/migration/legacy-users' && request.method === 'GET') {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const sourceSystem = url.searchParams.get('source_system')
    const sourceUserId = url.searchParams.get('source_user_id')
    const sourceHandle = url.searchParams.get('source_handle')
    const limit = parseLimit(url.searchParams.get('limit'))

    let query = 'SELECT * FROM legacy_user_links'
    const binds: unknown[] = []
    const where: string[] = []
    if (status) {
      where.push('import_status = ?')
      binds.push(status)
    }
    if (sourceSystem) {
      where.push('source_system = ?')
      binds.push(sourceSystem)
    }
    if (sourceUserId) {
      where.push('source_user_id = ?')
      binds.push(sourceUserId)
    }
    if (sourceHandle) {
      where.push('source_handle = ?')
      binds.push(sourceHandle)
    }
    if (where.length > 0) query += ` WHERE ${where.join(' AND ')}`
    query += ' ORDER BY linked_at DESC LIMIT ?'
    binds.push(limit)

    const rows = await env.DB.prepare(query).bind(...binds).all()
    return J({ ok: true, items: rows.results })
  }

  if (path === '/v1/migration/legacy-users' && request.method === 'POST') {
    let body: {
      user_id?: string
      source_system?: LegacySourceSystem
      source_user_id?: string
      source_handle?: string
      source_email?: string
      source_url?: string
      import_status?: LegacyUserImportStatus
    }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    if (!body.user_id || !body.source_system) {
      return J({ ok: false, error: 'user_id and source_system are required' }, 400)
    }

    const id = crypto.randomUUID()
    await env.DB.prepare(`
      INSERT INTO legacy_user_links (
        id, user_id, source_system, source_user_id, source_handle, source_email, source_url, import_status, linked_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      id,
      body.user_id,
      body.source_system,
      body.source_user_id ?? null,
      body.source_handle ?? null,
      body.source_email ?? null,
      body.source_url ?? null,
      body.import_status ?? 'linked',
    ).run()

    await writeMigrationAudit(env, {
      operation: 'legacy-users-create',
      sourceSystem: body.source_system,
      sourceRef: body.source_user_id ?? body.source_handle ?? null,
      actorRef: body.user_id,
      status: 'success',
    })

    return J({ ok: true, id }, 201)
  }

  if (path === '/v1/migration/legacy-content' && request.method === 'POST') {
    let body: {
      source_system?: LegacySourceSystem
      source_content_id?: string
      source_url?: string
      source_author_ref?: string
      content_type?: LegacyContentType
      title?: string
      content_hash?: string
      proof_url?: string
      wallet_address?: string
      collection?: string
      import_status?: LegacyContentImportStatus
      moderation_status?: LegacyModerationStatus
    }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    if (!body.source_system || !body.source_content_id || !body.content_type) {
      return J({ ok: false, error: 'source_system, source_content_id, content_type are required' }, 400)
    }

    const id = crypto.randomUUID()
    await env.DB.prepare(`
      INSERT INTO legacy_content_imports (
        id, source_system, source_content_id, source_url, source_author_ref, content_type, title,
        content_hash, proof_url, wallet_address, collection, import_status, moderation_status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      id,
      body.source_system,
      body.source_content_id,
      body.source_url ?? null,
      body.source_author_ref ?? null,
      body.content_type,
      body.title ?? null,
      body.content_hash ?? null,
      body.proof_url ?? null,
      body.wallet_address ?? null,
      body.collection ?? null,
      body.import_status ?? 'pending',
      body.moderation_status ?? 'pending',
    ).run()

    await writeMigrationAudit(env, {
      operation: 'legacy-content-create',
      sourceSystem: body.source_system,
      sourceRef: body.source_content_id,
      status: 'success',
      detail: {
        content_type: body.content_type,
      },
    })

    return J({ ok: true, id }, 201)
  }

  if (path === '/v1/migration/legacy-content' && request.method === 'GET') {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const sourceSystem = url.searchParams.get('source_system')
    const sourceContentId = url.searchParams.get('source_content_id')
    const limit = parseLimit(url.searchParams.get('limit'))

    let query = 'SELECT * FROM legacy_content_imports'
    const binds: unknown[] = []
    const where: string[] = []
    if (status) {
      where.push('import_status = ?')
      binds.push(status)
    }
    if (sourceSystem) {
      where.push('source_system = ?')
      binds.push(sourceSystem)
    }
    if (sourceContentId) {
      where.push('source_content_id = ?')
      binds.push(sourceContentId)
    }
    if (where.length > 0) {
      query += ` WHERE ${where.join(' AND ')}`
    }
    query += ' ORDER BY created_at DESC LIMIT ?'
    binds.push(limit)

    const rows = await env.DB.prepare(query).bind(...binds).all()
    return J({ ok: true, items: rows.results })
  }

  if (path === '/v1/migration/legacy-content/upsert' && request.method === 'POST') {
    let body: {
      source_system?: LegacySourceSystem
      source_content_id?: string
      source_url?: string
      source_author_ref?: string
      content_type?: LegacyContentType
      title?: string
      content_hash?: string
      proof_url?: string
      wallet_address?: string
      collection?: string
      import_status?: LegacyContentImportStatus
      moderation_status?: LegacyModerationStatus
      dry_run?: boolean
    }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    if (!body.source_system || !body.source_content_id || !body.content_type) {
      return J({ ok: false, error: 'source_system, source_content_id, content_type are required' }, 400)
    }

    const existing = await env.DB.prepare(
      'SELECT id, source_system, source_content_id, import_status, moderation_status, updated_at FROM legacy_content_imports WHERE source_system = ? AND source_content_id = ? LIMIT 1'
    ).bind(body.source_system, body.source_content_id).first()

    if (body.dry_run) {
      await writeMigrationAudit(env, {
        operation: 'legacy-content-upsert',
        sourceSystem: body.source_system,
        sourceRef: body.source_content_id,
        dryRun: true,
        status: 'success',
        detail: {
          action: existing ? 'update' : 'create',
          content_type: body.content_type,
        },
      })

      return J({
        ok: true,
        dry_run: true,
        action: existing ? 'update' : 'create',
        key: {
          source_system: body.source_system,
          source_content_id: body.source_content_id,
        },
        item: existing ?? null,
      })
    }

    const id = crypto.randomUUID()
    await env.DB.prepare(`
      INSERT INTO legacy_content_imports (
        id, source_system, source_content_id, source_url, source_author_ref, content_type, title,
        content_hash, proof_url, wallet_address, collection, import_status, moderation_status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      ON CONFLICT(source_system, source_content_id) DO UPDATE SET
        source_url=excluded.source_url,
        source_author_ref=excluded.source_author_ref,
        content_type=excluded.content_type,
        title=excluded.title,
        content_hash=excluded.content_hash,
        proof_url=excluded.proof_url,
        wallet_address=excluded.wallet_address,
        collection=excluded.collection,
        import_status=excluded.import_status,
        moderation_status=excluded.moderation_status,
        updated_at=datetime('now')
    `).bind(
      id,
      body.source_system,
      body.source_content_id,
      body.source_url ?? null,
      body.source_author_ref ?? null,
      body.content_type,
      body.title ?? null,
      body.content_hash ?? null,
      body.proof_url ?? null,
      body.wallet_address ?? null,
      body.collection ?? null,
      body.import_status ?? 'pending',
      body.moderation_status ?? 'pending',
    ).run()

    const row = await env.DB.prepare(
      'SELECT id, source_system, source_content_id, import_status, moderation_status, updated_at FROM legacy_content_imports WHERE source_system = ? AND source_content_id = ? LIMIT 1'
    ).bind(body.source_system, body.source_content_id).first()

    await writeMigrationAudit(env, {
      operation: 'legacy-content-upsert',
      sourceSystem: body.source_system,
      sourceRef: body.source_content_id,
      status: 'success',
      detail: {
        action: existing ? 'update' : 'create',
        content_type: body.content_type,
      },
    })

    return J({ ok: true, action: existing ? 'updated' : 'created', item: row })
  }

  if (path === '/v1/migration/legacy-users/upsert' && request.method === 'POST') {
    let body: {
      user_id?: string
      source_system?: LegacySourceSystem
      source_user_id?: string
      source_handle?: string
      source_email?: string
      source_url?: string
      import_status?: LegacyUserImportStatus
      dry_run?: boolean
    }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    if (!body.user_id || !body.source_system || (!body.source_user_id && !body.source_handle)) {
      return J({ ok: false, error: 'user_id, source_system, and source_user_id or source_handle are required' }, 400)
    }

    const existing = await findLegacyUser(env, body.source_system, body.source_user_id, body.source_handle)

    if (body.dry_run) {
      await writeMigrationAudit(env, {
        operation: 'legacy-users-upsert',
        sourceSystem: body.source_system,
        sourceRef: body.source_user_id ?? body.source_handle ?? null,
        actorRef: body.user_id,
        dryRun: true,
        status: 'success',
        detail: {
          action: existing ? 'update' : 'create',
          key: body.source_user_id ? 'source_user_id' : 'source_handle',
        },
      })

      return J({
        ok: true,
        dry_run: true,
        action: existing ? 'update' : 'create',
        key: body.source_user_id
          ? { source_system: body.source_system, source_user_id: body.source_user_id }
          : { source_system: body.source_system, source_handle: body.source_handle ?? null },
        item: existing ?? null,
      })
    }

    const id = crypto.randomUUID()
    if (body.source_user_id) {
      await env.DB.prepare(`
        INSERT INTO legacy_user_links (
          id, user_id, source_system, source_user_id, source_handle, source_email, source_url, import_status, linked_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        ON CONFLICT(source_system, source_user_id) DO UPDATE SET
          user_id=excluded.user_id,
          source_handle=COALESCE(excluded.source_handle, legacy_user_links.source_handle),
          source_email=excluded.source_email,
          source_url=excluded.source_url,
          import_status=excluded.import_status,
          updated_at=datetime('now')
      `).bind(
        id,
        body.user_id,
        body.source_system,
        body.source_user_id,
        body.source_handle ?? null,
        body.source_email ?? null,
        body.source_url ?? null,
        body.import_status ?? 'linked',
      ).run()
    } else {
      await env.DB.prepare(`
        INSERT INTO legacy_user_links (
          id, user_id, source_system, source_user_id, source_handle, source_email, source_url, import_status, linked_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        ON CONFLICT(source_system, source_handle) DO UPDATE SET
          user_id=excluded.user_id,
          source_user_id=COALESCE(excluded.source_user_id, legacy_user_links.source_user_id),
          source_email=excluded.source_email,
          source_url=excluded.source_url,
          import_status=excluded.import_status,
          updated_at=datetime('now')
      `).bind(
        id,
        body.user_id,
        body.source_system,
        null,
        body.source_handle ?? null,
        body.source_email ?? null,
        body.source_url ?? null,
        body.import_status ?? 'linked',
      ).run()
    }

    const row = await findLegacyUser(env, body.source_system, body.source_user_id, body.source_handle)

    await writeMigrationAudit(env, {
      operation: 'legacy-users-upsert',
      sourceSystem: body.source_system,
      sourceRef: body.source_user_id ?? body.source_handle ?? null,
      actorRef: body.user_id,
      status: 'success',
      detail: {
        action: existing ? 'update' : 'create',
        key: body.source_user_id ? 'source_user_id' : 'source_handle',
      },
    })

    return J({ ok: true, action: existing ? 'updated' : 'created', item: row })
  }

  if (path === '/v1/migration/legacy-content/mark-imported-by-source' && request.method === 'POST') {
    let body: {
      source_system?: LegacySourceSystem
      source_content_id?: string
      imported_post_id?: string
      imported_lesson_id?: string
      imported_doc_id?: string
      imported_by?: string
    }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    if (!body.source_system || !body.source_content_id) {
      return J({ ok: false, error: 'source_system and source_content_id are required' }, 400)
    }

    const current = await env.DB.prepare(
      'SELECT id, import_status FROM legacy_content_imports WHERE source_system=? AND source_content_id=? LIMIT 1'
    ).bind(body.source_system, body.source_content_id).first<{ id: string; import_status: string }>()

    if (!current) return J({ ok: false, error: 'legacy content not found' }, 404)

    await env.DB.prepare(`
      UPDATE legacy_content_imports
      SET import_status='imported',
          moderation_status='approved',
          imported_post_id=COALESCE(?, imported_post_id),
          imported_lesson_id=COALESCE(?, imported_lesson_id),
          imported_doc_id=COALESCE(?, imported_doc_id),
          imported_by=COALESCE(?, imported_by),
          imported_at=COALESCE(imported_at, datetime('now')),
          updated_at=datetime('now')
      WHERE source_system=? AND source_content_id=?
    `).bind(
      body.imported_post_id ?? null,
      body.imported_lesson_id ?? null,
      body.imported_doc_id ?? null,
      body.imported_by ?? null,
      body.source_system,
      body.source_content_id,
    ).run()

    const row = await env.DB.prepare(
      'SELECT * FROM legacy_content_imports WHERE source_system=? AND source_content_id=? LIMIT 1'
    ).bind(body.source_system, body.source_content_id).first()

    await writeMigrationAudit(env, {
      operation: 'legacy-content-mark-imported-by-source',
      sourceSystem: body.source_system,
      sourceRef: body.source_content_id,
      actorRef: body.imported_by ?? null,
      status: 'success',
    })

    return J({ ok: true, item: row })
  }

  if (path === '/v1/migration/legacy-content/mark-imported' && request.method === 'POST') {
    let body: {
      id?: string
      imported_post_id?: string
      imported_lesson_id?: string
      imported_doc_id?: string
      imported_by?: string
    }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    if (!body.id) return J({ ok: false, error: 'id is required' }, 400)

    await env.DB.prepare(`
      UPDATE legacy_content_imports
      SET import_status='imported',
          moderation_status='approved',
          imported_post_id=?,
          imported_lesson_id=?,
          imported_doc_id=?,
          imported_by=?,
          imported_at=datetime('now'),
          updated_at=datetime('now')
      WHERE id=?
    `).bind(
      body.imported_post_id ?? null,
      body.imported_lesson_id ?? null,
      body.imported_doc_id ?? null,
      body.imported_by ?? null,
      body.id,
    ).run()

    await writeMigrationAudit(env, {
      operation: 'legacy-content-mark-imported',
      sourceRef: body.id,
      actorRef: body.imported_by ?? null,
      status: 'success',
    })

    return J({ ok: true })
  }

  if (path === '/v1/migration/audit-events' && request.method === 'GET') {
    const url = new URL(request.url)
    const operation = url.searchParams.get('operation')
    const status = url.searchParams.get('status')
    const sourceSystem = url.searchParams.get('source_system')
    const limit = parseLimit(url.searchParams.get('limit'))

    let query = 'SELECT * FROM migration_audit_events'
    const binds: unknown[] = []
    const where: string[] = []

    if (operation) {
      where.push('operation = ?')
      binds.push(operation)
    }
    if (status) {
      where.push('status = ?')
      binds.push(status)
    }
    if (sourceSystem) {
      where.push('source_system = ?')
      binds.push(sourceSystem)
    }
    if (where.length > 0) query += ` WHERE ${where.join(' AND ')}`
    query += ' ORDER BY created_at DESC LIMIT ?'
    binds.push(limit)

    const rows = await env.DB.prepare(query).bind(...binds).all()
    return J({ ok: true, items: rows.results })
  }

  return J({ ok: false, error: 'Not found' }, 404)
}
