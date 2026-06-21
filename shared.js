// shared.js — utilities shared across ksat-dday pages

const SEASON_PARTICLES = {
    spring:   { chars: ['🌸','🌺','🌷','✿'], count: 14, type: 'fall',  min: 8,  max: 14 },
    summer:   { chars: ['💧','☀️','✨','🫧'],  count: 12, type: 'float', min: 4,  max: 8  },
    autumn:   { chars: ['🍁','🍂','🍃'],       count: 14, type: 'fall',  min: 7,  max: 13 },
    winter:   { chars: ['❄','❅','❆','✦'],     count: 20, type: 'fall',  min: 9,  max: 16 },
    imminent: { chars: ['🔥','✦','✧'],         count: 12, type: 'ember', min: 4,  max: 9  }
};

// ── 수능/6모 일정 (자동 연도 전환용) ──────────────────────────
const SUNEUNG_LIST = [
    { year: 2027, date: '2026-11-19', dateText: '2026년 11월 19일 (목)' },
    { year: 2028, date: '2027-11-18', dateText: '2027년 11월 18일 (목)' }
];
const SIXMO_LIST = [
    { year: 2027, date: '2026-06-04', dateText: '2026년 6월 4일 (목)' },
    { year: 2028, date: '2027-06-03', dateText: '2027년 6월 3일 (목)' }
];
const NINEMO_LIST = [
    { year: 2027, date: '2026-09-02', dateText: '2026년 9월 2일 (수)' },
    { year: 2028, date: '2027-09-01', dateText: '2027년 9월 1일 (수)' }
];
const SUNEUNG_BASELINE = { year: 2026, date: '2025-11-13' };

// 시험 종료 cutoff (탐구 영역 종료 시각, KST 16:37)
const EXAM_END_HH = 16, EXAM_END_MM = 37;
function _examEndKST(dateStr) {
    const hh = String(EXAM_END_HH).padStart(2, '0');
    const mm = String(EXAM_END_MM).padStart(2, '0');
    return new Date(dateStr + 'T' + hh + ':' + mm + ':00+09:00');
}

// 개발자 미리보기: ?now=2026-06-05T17:00 으로 현재 시각 가상화 가능
function _nowSimulated() {
    try {
        const u = new URL(window.location.href);
        const nowParam = u.searchParams.get('now');
        if (nowParam) {
            const d = new Date(nowParam);
            if (!isNaN(d.getTime())) return d;
        }
    } catch (e) {}
    return new Date();
}

function _parseLocalDate(s) { return new Date(s + 'T00:00:00'); }
function _todayLocal() { const d = _nowSimulated(); d.setHours(0, 0, 0, 0); return d; }

function getActiveSuneung() {
    const t = _todayLocal();
    for (const s of SUNEUNG_LIST) {
        if (_parseLocalDate(s.date) >= t) return s;
    }
    return SUNEUNG_LIST[SUNEUNG_LIST.length - 1];
}

function getPreviousSuneung() {
    const t = _todayLocal();
    let prev = SUNEUNG_BASELINE;
    for (const s of SUNEUNG_LIST) {
        if (_parseLocalDate(s.date) >= t) return prev;
        prev = s;
    }
    return prev;
}

// 시험 종료 cutoff 기반: 시행일 16:37까지는 그 회차 반환, 이후엔 다음 회차
function _activeAfterCutoff(list) {
    const now = _nowSimulated();
    for (const s of list) {
        if (_examEndKST(s.date) > now) return s;
    }
    return list[list.length - 1];
}

function getActiveSixMo() { return _activeAfterCutoff(SIXMO_LIST); }
function getActiveNineMo() { return _activeAfterCutoff(NINEMO_LIST); }

// 특정 학년도의 6모/9모 (진행률 시작점 계산용 — cutoff 무시, year로 직접 매칭)
function getSixMoForYear(year) {
    for (const s of SIXMO_LIST) { if (s.year === year) return s; }
    return null;
}

// 메인 페이지의 두 번째 탭 결정 — '6mo' | '9mo' | null (null이면 수능 단일 탭)
// 일반 사용자: 현재 시각 기준 자동 결정 (6/4 16:37 → 9모, 9/2 16:37 → null)
// 개발자: ?preview=6mo|9mo|none 으로 강제 (URL 모르면 안 보임)
function getSecondTab() {
    try {
        const u = new URL(window.location.href);
        const preview = u.searchParams.get('preview');
        if (preview === '6mo' || preview === '9mo') return preview;
        if (preview === 'none') return null;
    } catch (e) {}

    const now = _nowSimulated();
    const sun = getActiveSuneung();
    const six = getActiveSixMo();
    const nine = getActiveNineMo();
    const sixEnd = _examEndKST(six.date);
    const nineEnd = _examEndKST(nine.date);
    const candidates = [];
    if (sixEnd > now)  candidates.push({ key: '6mo', date: six.date });
    if (nineEnd > now) candidates.push({ key: '9mo', date: nine.date });
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => (a.date < b.date ? -1 : 1));
    const best = candidates[0];
    // 수능보다 더 가까울 때만 노출 (9모 끝나면 다음 6모는 너무 멀어서 수능만 보여줌)
    if (best.date >= sun.date) return null;
    return best.key;
}

function renderParticles(season) {
    // 파티클 효과 비활성화 (저사양·일부 환경에서 렉 발생)
    // SEASON_PARTICLES 데이터/CSS는 유지 — 부활 시 아래 본문 복원만 하면 됨
    const container = document.getElementById('particles');
    if (container) container.innerHTML = '';
}

function getAutoSeason() {
    const sun = getActiveSuneung();
    const dday = Math.ceil((_parseLocalDate(sun.date) - _todayLocal()) / 86400000);
    if (dday >= 0 && dday <= 30) return 'imminent';
    const m = new Date().getMonth() + 1;
    if (m >= 3 && m <= 5)  return 'spring';
    if (m >= 6 && m <= 8)  return 'summer';
    if (m >= 9 && m <= 11) return 'autumn';
    return 'winter';
}

function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function timeAgo(date) {
    if (!date) return '';
    const diff = (Date.now() - date.getTime()) / 1000;
    if (diff < 60)     return '방금 전';
    if (diff < 3600)   return Math.floor(diff / 60)    + '분 전';
    if (diff < 86400)  return Math.floor(diff / 3600)  + '시간 전';
    if (diff < 604800) return Math.floor(diff / 86400) + '일 전';
    return date.toLocaleDateString('ko-KR');
}

// ── 다크모드 헬퍼 ───────────────────────────────────────────
function initDarkTheme() {
    const saved = localStorage.getItem('ui-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
}

function setupDarkToggle(btnId, onChange) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    function updateIcon() {
        btn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
    }
    btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('ui-theme', next);
        updateIcon();
        if (onChange) onChange(next);
    });
    updateIcon();
}

// ── Nav 햄버거 메뉴 ─────────────────────────────────────────
function setupNavMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;
    function close() { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    function open()  { menu.classList.add('open');    toggle.setAttribute('aria-expanded', 'true');  }
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (menu.classList.contains('open')) close(); else open();
    });
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) close();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    // 메뉴 안 링크 클릭 시 닫기 (페이지 이동 전)
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => close()));
}

// ── 시즌 팔레트 헬퍼 ────────────────────────────────────────
function setupPaletteMenu(btnId, menuId) {
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    if (!btn || !menu) return;
    btn.addEventListener('click', e => { e.stopPropagation(); menu.classList.toggle('open'); });
    document.addEventListener('click', e => {
        if (!menu.contains(e.target) && e.target !== btn) menu.classList.remove('open');
    });
}

function getSeasonChoice() {
    try { return localStorage.getItem('suneung-season') || 'auto'; } catch (e) { return 'auto'; }
}

function saveSeasonChoice(val) {
    try { localStorage.setItem('suneung-season', val); } catch (e) {}
}

function resolveSeason(choice) {
    if (choice === 'default') return null;
    if (choice === 'auto')    return getAutoSeason();
    return choice;
}

// ── 관리자 마킹 (자료실 nav 노출용) ──────────────────────────
// Firestore Rules / R2 Worker 토큰 검증이 실제 권한을 강제. 여기는 UI 게이팅만.
const ADMIN_UID = 'ffDuvRuJBNUd7KibdHEWO7BMefe2';

// 기출문제 자료실 파일 게이트웨이 (Cloudflare Worker + R2).
const ARCHIVE_BASE = 'https://ksat-archive.littird3.workers.dev';

function isAdminMarked() {
    try { return localStorage.getItem('is-admin') === '1'; } catch (e) { return false; }
}
function markAdmin()   { try { localStorage.setItem('is-admin', '1'); } catch (e) {} }
function unmarkAdmin() { try { localStorage.removeItem('is-admin'); } catch (e) {} }

// 관리자라면 .nav-link-archive·.nav-link-news 링크 노출. 그렇지 않으면 CSS 기본값(숨김) 유지.
function applyArchiveNavVisibility() {
    if (!isAdminMarked()) return;
    document.querySelectorAll('.nav-link-archive, .nav-link-news').forEach(a => { a.style.display = ''; });
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyArchiveNavVisibility);
    } else {
        applyArchiveNavVisibility();
    }
}
