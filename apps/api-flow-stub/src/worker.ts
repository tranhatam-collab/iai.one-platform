/**
 * Minimal public surface for api.flow.iai.one
 * Full mail-api handler deploy is Team 2 follow-up.
 */
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const now = new Date().toISOString();
    const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();

    const cors = {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-allow-headers": "content-type, x-request-id, x-workspace-id",
      "content-type": "application/json; charset=utf-8"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "GET") {
      return Response.json(
        { ok: false, error: { code: "METHOD_NOT_ALLOWED", message: "GET only on stub" }, requestId },
        { status: 405, headers: cors }
      );
    }

    if (url.pathname === "/health") {
      return Response.json(
        { ok: true, data: { service: "api.flow", status: "ok", timestamp: now }, requestId },
        { headers: cors }
      );
    }

    if (url.pathname === "/v1/meta" || url.pathname === "/v1/flow/meta") {
      return Response.json(
        {
          ok: true,
          data: {
            service: "api.flow",
            release: { name: "api.flow", apiCompat: "v1", environment: "workers-stub" },
            capabilities: {
              flow: true,
              sourceOfTruth: true,
              runtimeExecutions: true,
              audit: true,
              billing: true
            },
            routes: {
              health: "/health",
              meta: "/v1/meta",
              sourceOfTruth: "/v1/flow/source-of-truth"
            }
          },
          requestId
        },
        { headers: cors }
      );
    }

    return Response.json(
      {
        ok: false,
        error: {
          code: "NOT_FOUND",
          message: "Route not implemented on stub; deploy full mail-api for /v1/flow/*"
        },
        requestId
      },
      { status: 404, headers: cors }
    );
  }
};
