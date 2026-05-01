// shared.js — utilities shared across ksat-dday pages

const SEASON_PARTICLES = {
    spring:   { chars: ['🌸','🌺','🌷','✿'], count: 14, type: 'fall',  min: 8,  max: 14 },
    summer:   { chars: ['💧','☀️','✨','🫧'],  count: 12, type: 'float', min: 4,  max: 8  },
    autumn:   { chars: ['🍁','🍂','🍃'],       count: 14, type: 'fall',  min: 7,  max: 13 },
    winter:   { chars: ['❄','❅','❆','✦'],     count: 20, type: 'fall',  min: 9,  max: 16 },
    imminent: { chars: ['🔥','✦','✧'],         count: 12, type: 'ember', min: 4,  max: 9  }
};

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
    const dday = Math.ceil((new Date('2026-11-19') - new Date()) / 86400000);
    if (dday >= 0 && dday <= 30) return 'imminent';
    const m = new Date().getMonth() + 1;
    if (m >= 3 && m <= 5)  return 'spring';
    if (m >= 6 && m <= 8)  return 'summer';
    if (m >= 9 && m <= 11) return 'autumn';
    return 'winter';
}

function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
