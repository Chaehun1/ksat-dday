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
const SUNEUNG_BASELINE = { year: 2026, date: '2025-11-13' };

function _parseLocalDate(s) { return new Date(s + 'T00:00:00'); }
function _todayLocal() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }

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

function getActiveSixMo() {
    const t = _todayLocal();
    for (const s of SIXMO_LIST) {
        if (_parseLocalDate(s.date) >= t) return s;
    }
    return SIXMO_LIST[SIXMO_LIST.length - 1];
}

function renderParticles(season) {
    const container = document.getElementById('particles');
    if (!container) return;
    container.innerHTML = '';
    const cfg = SEASON_PARTICLES[season];
    if (!cfg) return;
    for (let i = 0; i < cfg.count; i++) {
        const p = document.createElement('span');
        p.className = 'particle ' + cfg.type;
        p.textContent = cfg.chars[Math.floor(Math.random() * cfg.chars.length)];
        const dur = cfg.min + Math.random() * (cfg.max - cfg.min);
        p.style.left = (Math.random() * 100) + 'vw';
        p.style.animationDuration = dur + 's';
        p.style.animationDelay = (Math.random() * cfg.max * -1) + 's';
        p.style.fontSize = (0.9 + Math.random() * 1.1) + 'em';
        p.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
        p.style.setProperty('--spin',  (Math.random() * 720 - 360) + 'deg');
        if (cfg.type === 'float') p.style.top = (Math.random() * 90 + 5) + 'vh';
        container.appendChild(p);
    }
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
