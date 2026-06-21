/**
 * ksat-archive — Cloudflare Worker
 *
 * 기출문제 자료실용 R2 게이트웨이.
 *   GET  /archive/<key>   → R2에서 파일 서빙 (공개, egress 무료)
 *   POST /upload          → Firebase ID 토큰 검증(관리자 UID) 후 R2 저장
 *   POST /delete          → 관리자 검증 후 prefix 일괄 삭제
 *
 * 권한: Firestore와 동일한 모델 — Firebase 익명 인증 토큰의 UID가
 *       ADMIN_UID와 일치할 때만 쓰기/삭제 허용. 별도 비밀번호 없음.
 */

const PROJECT_ID = 'ksat-dday-bc76f';
const ADMIN_UID  = 'ffDuvRuJBNUd7KibdHEWO7BMefe2';
const JWK_URL    = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

// 쓰기 요청(fetch)을 허용할 출처. 다운로드(GET)는 일반 네비게이션이라 CORS 불필요.
const ALLOWED_ORIGINS = [
  'https://chaehun1.github.io',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }
    if (request.method === 'GET' || request.method === 'HEAD') {
      return handleGet(url, env, request);
    }
    if (request.method === 'POST' && url.pathname === '/upload') {
      return handleUpload(request, env);
    }
    if (request.method === 'POST' && url.pathname === '/delete') {
      return handleDelete(request, env);
    }
    return new Response('Not found', { status: 404 });
  },
};

// ── 다운로드 (공개) ──────────────────────────────────────────────
async function handleGet(url, env, request) {
  let key;
  try { key = decodeURIComponent(url.pathname.replace(/^\/+/, '')); }
  catch { return new Response('Bad path', { status: 400 }); }

  if (!isAllowedKey(key) || key.includes('..')) {
    return new Response('Forbidden', { status: 403 });
  }

  const obj = await env.BUCKET.get(key);
  if (!obj || !obj.body) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  // ?dl=1 이면 강제 다운로드, 아니면 브라우저에서 바로 보기
  if (url.searchParams.get('dl') === '1') {
    const filename = key.split('/').pop();
    headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
  }

  return new Response(request.method === 'HEAD' ? null : obj.body, { headers });
}

// ── 업로드 (관리자 전용) ─────────────────────────────────────────
async function handleUpload(request, env) {
  const cors = corsHeaders(request);

  const payload = await requireAdmin(request);
  if (!payload) return json({ error: 'unauthorized' }, 401, cors);

  let form;
  try { form = await request.formData(); }
  catch { return json({ error: 'invalid form' }, 400, cors); }

  const file = form.get('file');
  const key  = form.get('key');

  if (!file || typeof file === 'string') return json({ error: 'no file' }, 400, cors);
  if (!key || typeof key !== 'string' || !isAllowedKey(key) || key.includes('..')) {
    return json({ error: 'bad key' }, 400, cors);
  }

  const buf = await file.arrayBuffer();
  await env.BUCKET.put(key, buf, {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  });

  const origin = new URL(request.url).origin;
  const publicUrl = origin + '/' + key.split('/').map(encodeURIComponent).join('/');
  return json({ url: publicUrl, key, size: buf.byteLength }, 200, cors);
}

// ── 삭제 (관리자 전용, prefix 일괄) ──────────────────────────────
async function handleDelete(request, env) {
  const cors = corsHeaders(request);

  const payload = await requireAdmin(request);
  if (!payload) return json({ error: 'unauthorized' }, 401, cors);

  let body;
  try { body = await request.json(); }
  catch { return json({ error: 'invalid json' }, 400, cors); }

  const prefix = body && body.prefix;
  if (!prefix || typeof prefix !== 'string' || !isAllowedKey(prefix) || prefix.includes('..')) {
    return json({ error: 'bad prefix' }, 400, cors);
  }

  let deleted = 0, cursor;
  do {
    const listed = await env.BUCKET.list({ prefix, cursor });
    if (listed.objects.length) {
      await env.BUCKET.delete(listed.objects.map(o => o.key));
      deleted += listed.objects.length;
    }
    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor);

  return json({ deleted }, 200, cors);
}

// ── Firebase ID 토큰 검증 ───────────────────────────────────────
async function requireAdmin(request) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const payload = await verifyFirebaseToken(token);
  if (!payload || payload.sub !== ADMIN_UID) return null;
  return payload;
}

let jwkCache = { map: null, exp: 0 };
async function getJWKs() {
  const now = Date.now();
  if (jwkCache.map && now < jwkCache.exp) return jwkCache.map;
  const res = await fetch(JWK_URL);
  const data = await res.json();
  const map = {};
  for (const k of data.keys) map[k.kid] = k;
  const cc = res.headers.get('cache-control') || '';
  const m = cc.match(/max-age=(\d+)/);
  const ttl = (m ? parseInt(m[1], 10) : 3600) * 1000;
  jwkCache = { map, exp: now + ttl };
  return map;
}

async function verifyFirebaseToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [h64, p64, s64] = parts;

    const header  = JSON.parse(b64urlToString(h64));
    const payload = JSON.parse(b64urlToString(p64));
    const now = Math.floor(Date.now() / 1000);

    if (header.alg !== 'RS256') return null;
    if (!payload.sub) return null;
    if (payload.aud !== PROJECT_ID) return null;
    if (payload.iss !== `https://securetoken.google.com/${PROJECT_ID}`) return null;
    if (typeof payload.exp !== 'number' || payload.exp < now) return null;
    if (typeof payload.iat !== 'number' || payload.iat > now + 300) return null;

    const jwks = await getJWKs();
    const jwk = jwks[header.kid];
    if (!jwk) return null;

    const key = await crypto.subtle.importKey(
      'jwk',
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    const data = new TextEncoder().encode(h64 + '.' + p64);
    const sig = b64urlToBytes(s64);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, sig, data);
    return ok ? payload : null;
  } catch {
    return null;
  }
}

// 서빙·쓰기를 허용할 키 prefix (기출 자료실 + 카드뉴스)
function isAllowedKey(k) {
  return typeof k === 'string' && (k.startsWith('archive/') || k.startsWith('news/'));
}

// ── 유틸 ────────────────────────────────────────────────────────
function b64urlToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
function b64urlToString(s) {
  return new TextDecoder().decode(b64urlToBytes(s));
}

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...(cors || {}) },
  });
}
