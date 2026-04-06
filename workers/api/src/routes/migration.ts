import { json } from '../lib/cors'
import type { Bindings, LegacySourceSystem } from '../types'

function isAdmin(request: Request, env: Bindings): boolean {
  const auth = request.headers.get('Authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  const headerSecret = request.headers.get('x-iai-admin-secret') || token
  return Boolean(env.IAI_ADMIN_SECRET && headerSecret === env.IAI_ADMIN_SECRET)
}

export async function handleMigration(request: Request, env: Bindings, path: string): Promise<Response> {
  const origin = request.headers.get('Origin')
  const J = (d: unknown, s = 200) => json(d, s, origin, env.ALLOWED_ORIGINS)

  if (!path.startsWith('/v1/migration/')) {
    return J({ ok: false, error: 'Not found' }, 404)
  }

  if (!isAdmin(request, env)) {
    return J({ ok: false, error: 'Forbidden' }, 403)
  }

  if (path === '/v1/migration/health' && request.method === 'GET') {
    const links = await env.DB.prepare('SELECT COUNT(*) as count FROM legacy_user_links').first<{ count: number }>()
    const imports = await env.DB.prepare('SELECT COUNT(*) as count FROM legacy_content_imports').first<{ count: number }>()
    return J({
      ok: true,
      legacy_user_links: links?.count ?? 0,
      legacy_content_imports: imports?.count ?? 0,
      mode: 'wave1',
    })
  }

  if (path === '/v1/migration/legacy-users' && request.method === 'POST') {
    let body: {
      user_id?: string
      source_system?: LegacySourceSystem
      source_user_id?: string
      source_handle?: string
      source_email?: string
      source_url?: string
      import_status?: 'linked' | 'pending_review' | 'blocked'
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

    return J({ ok: true, id }, 201)
  }

  if (path === '/v1/migration/legacy-content' && request.method === 'POST') {
    let body: {
      source_system?: LegacySourceSystem
      source_content_id?: string
      source_url?: string
      source_author_ref?: string
      content_type?: 'post' | 'lesson' | 'document' | 'asset'
      title?: string
      content_hash?: string
      proof_url?: string
      wallet_address?: string
      collection?: string
      import_status?: 'pending' | 'imported' | 'rejected' | 'needs_review'
      moderation_status?: 'pending' | 'approved' | 'flagged'
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

    return J({ ok: true, id }, 201)
  }

  if (path === '/v1/migration/legacy-content' && request.method === 'GET') {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 200)

    let query = 'SELECT * FROM legacy_content_imports'
    const binds: unknown[] = []
    if (status) {
      query += ' WHERE import_status = ?'
      binds.push(status)
    }
    query += ' ORDER BY created_at DESC LIMIT ?'
    binds.push(limit)

    const rows = await env.DB.prepare(query).bind(...binds).all()
    return J({ ok: true, items: rows.results })
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

    return J({ ok: true })
  }

  return J({ ok: false, error: 'Not found' }, 404)
}
