/* ============================================================
   FX: efek visual tingkat lanjut (transisi, sphere 3D, palette, dll)
   ============================================================ */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = matchMedia('(hover: none)').matches;
const rand = (a, b) => a + Math.random() * (b - a);
const PAGES = ['home', 'about', 'skills', 'projects', 'company', 'lab', 'education', 'terminal', 'contact'];
const FX = window.FX = {};

/* ---------- 1. Tile-dissolve page transition ---------- */
FX.transition = (mid, id) => new Promise(resolve => {
  if (reduce) { mid(); resolve(); return; }
  const cv = $('#tiles'), ctx = cv.getContext('2d');
  const W = cv.width = innerWidth, H = cv.height = innerHeight;
  cv.style.display = 'block';
  const S = Math.ceil(Math.max(W, H) / 16), cols = Math.ceil(W / S), rows = Math.ceil(H / S);
  const mk = () => {
    const ox = rand(0, cols), oy = rand(0, rows), maxD = Math.hypot(cols, rows), a = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
      a.push({ c, r, d: Math.hypot(c - ox, r - oy) / maxD * .62 + Math.random() * .2, ch: Math.random() < .5 ? '0' : '1' });
    return a;
  };
  const glyph = '01<>{}/#$';
  const draw = (tiles, prog, invert, label) => {
    ctx.clearRect(0, 0, W, H);
    ctx.font = `700 ${S * .38}px "JetBrains Mono",monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    let full = true;
    for (const t of tiles) {
      let p = Math.max(0, Math.min(1, (prog - t.d) / .28));
      if (invert) p = 1 - p;
      if (p < 1) full = false;
      if (p <= 0) continue;
      const sz = p >= 1 ? S + 1 : S * p, x = t.c * S + (S - sz) / 2, y = t.r * S + (S - sz) / 2;
      ctx.fillStyle = p >= 1 ? '#050e24' : `rgba(7,20,51,${.7 + p * .3})`;
      ctx.fillRect(x, y, sz, sz);
      if (p < 1) {
        ctx.strokeStyle = `rgba(56,225,255,${.8 * (1 - p) + .15})`; ctx.lineWidth = 1.5;
        ctx.strokeRect(x + .5, y + .5, sz - 1, sz - 1);
        ctx.fillStyle = `rgba(56,225,255,${1 - p})`;
        ctx.fillText(Math.random() < .08 ? glyph[(Math.random() * glyph.length) | 0] : t.ch, x + sz / 2, y + sz / 2);
      }
    }
    if (label) {
      ctx.font = '500 16px "JetBrains Mono",monospace'; ctx.fillStyle = '#38E1FF';
      ctx.fillText(label, W / 2, H / 2);
    }
  };
  const A = mk(), B = mk(), D1 = 520, D2 = 560;
  let t0 = performance.now();
  (function p1(now) {
    const k = Math.min(1, (now - t0) / D1);
    draw(A, k * 1.1, false, k > .9 ? '> load("' + id + '")' : '');
    if (k < 1) return requestAnimationFrame(p1);
    mid();
    setTimeout(() => {
      t0 = performance.now();
      (function p2(now2) {
        const k2 = Math.min(1, (now2 - t0) / D2);
        draw(B, k2 * 1.1, true, '');
        if (k2 < 1) return requestAnimationFrame(p2);
        cv.style.display = 'none'; ctx.clearRect(0, 0, W, H); resolve();
      })(performance.now());
    }, 140);
  })(t0);
});

/* ---------- 2. Text scramble (decode) ---------- */
FX.scramble = el => {
  if (reduce || !el) return;
  const final = el.dataset.final || (el.dataset.final = el.textContent);
  const chars = '01<>/\\{}[]#$%&*+=?', n = final.length, total = 26;
  let f = 0; clearInterval(el._sc);
  el._sc = setInterval(() => {
    f++; let s = '';
    for (let i = 0; i < n; i++) s += (final[i] === ' ' || i < n * f / total) ? final[i] : chars[(Math.random() * chars.length) | 0];
    el.textContent = s;
    if (f >= total) { clearInterval(el._sc); el.textContent = final; }
  }, 32);
};
FX.onPage = id => {
  $$('#' + id + ' .split > span').forEach(el => { delete el.dataset.final; FX.scramble(el); });
  const lbl = $('#hudPage'); if (lbl) lbl.textContent = id;
};

/* ---------- 3. Interactive 3D point sphere (hero) ---------- */
(function sphere() {
  const cv = $('#sphere'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const DPR = Math.min(devicePixelRatio || 1, 2);
  let S = 0;
  const size = () => { S = cv.clientWidth * DPR; cv.width = cv.height = S; };
  size(); addEventListener('resize', size);
  const N = 230, pts = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
    pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, amber: Math.random() < .1 });
  }
  const labels = [[10, 'ML'], [48, 'ESP32'], [90, 'AI'], [130, 'IoT'], [170, 'Python?'], [205, '</>']];
  labels[4] = [170, 'Data'];
  let mx = 0, my = 0, rotY = 0, rotX = .35, pulses = [];
  addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
  const home = $('#home');
  function frame() {
    requestAnimationFrame(frame);
    if (!home.classList.contains('active')) return;
    rotY += .004 + mx * .01; rotX += (.35 + my * .5 - rotX) * .05;
    const cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(rotX), sx = Math.sin(rotX);
    const R = S * .47, c = S / 2;
    const P = pts.map(p => {
      let x = p.x * cy - p.z * sy, z = p.x * sy + p.z * cy, y = p.y * cx - z * sx; z = p.y * sx + z * cx;
      const k = 1 / (1.9 - z * .5);
      return { sx: c + x * R * k * 1.55, sy: c + y * R * k * 1.55, z, k, amber: p.amber };
    });
    ctx.clearRect(0, 0, S, S);
    ctx.lineWidth = DPR * .7;
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j += 1) {
      const a = pts[i], b = pts[j], d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
      if (d < .11) {
        const al = ((P[i].z + P[j].z) / 2 + 1) / 2;
        ctx.strokeStyle = `rgba(80,150,255,${.08 + al * .38})`;
        ctx.beginPath(); ctx.moveTo(P[i].sx, P[i].sy); ctx.lineTo(P[j].sx, P[j].sy); ctx.stroke();
        if (Math.random() < .00035 && pulses.length < 10) pulses.push({ i, j, p: 0 });
      }
    }
    for (let i = 0; i < N; i++) {
      const q = P[i], al = (q.z + 1) / 2;
      ctx.globalAlpha = .25 + al * .75;
      ctx.fillStyle = q.amber ? '#FFB84D' : '#38E1FF';
      ctx.beginPath(); ctx.arc(q.sx, q.sy, (1 + al * 2.2) * DPR, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
    pulses = pulses.filter(p => (p.p += .03) < 1);
    for (const p of pulses) {
      const a = P[p.i], b = P[p.j];
      ctx.fillStyle = '#fff'; ctx.shadowColor = '#38E1FF'; ctx.shadowBlur = 14 * DPR;
      ctx.beginPath(); ctx.arc(a.sx + (b.sx - a.sx) * p.p, a.sy + (b.sy - a.sy) * p.p, 2.6 * DPR, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
    }
    ctx.font = `600 ${11 * DPR}px "JetBrains Mono",monospace`; ctx.textAlign = 'center';
    for (const [i, txt] of labels) {
      const q = P[i]; if (q.z < -.1) continue;
      const w = ctx.measureText(txt).width + 14 * DPR;
      ctx.fillStyle = 'rgba(4,10,24,.8)'; ctx.fillRect(q.sx - w / 2, q.sy - 9 * DPR, w, 18 * DPR);
      ctx.strokeStyle = 'rgba(56,225,255,.7)'; ctx.strokeRect(q.sx - w / 2, q.sy - 9 * DPR, w, 18 * DPR);
      ctx.fillStyle = '#38E1FF'; ctx.fillText(txt, q.sx, q.sy + 4 * DPR);
    }
  }
  if (!reduce) frame();
})();

/* ---------- 4. Matrix rain toggle ---------- */
(function matrix() {
  const cv = $('#matrix'), ctx = cv.getContext('2d');
  let on = false, cols = [], W, H, raf;
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}<>/=+#';
  const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; cols = Array.from({ length: Math.ceil(W / 18) }, () => rand(-40, 0)); };
  function draw() {
    if (!on) return;
    ctx.clearRect(0, 0, W, H); ctx.font = '15px "JetBrains Mono",monospace';
    cols.forEach((y, i) => {
      for (let k = 0; k < 18; k++) {
        const yy = (y - k) * 18; if (yy < 0 || yy > H) continue;
        ctx.fillStyle = k === 0 ? '#e8fbff' : `rgba(56,225,255,${1 - k / 18})`;
        ctx.fillText(chars[(Math.random() * chars.length) | 0], i * 18, yy);
      }
      cols[i] += rand(.2, .5);
      if (cols[i] * 18 - 18 * 18 > H && Math.random() > .975) cols[i] = rand(-20, 0);
    });
    raf = requestAnimationFrame(draw);
  }
  FX.matrix = force => {
    on = typeof force === 'boolean' ? force : !on;
    cv.classList.toggle('on', on);
    if (on) { size(); draw(); } else cancelAnimationFrame(raf);
    return on;
  };
  addEventListener('resize', () => on && size());
})();

/* ---------- 5. Command palette ---------- */
(function palette() {
  const box = $('#palette'), inp = $('#palIn'), list = $('#palList');
  let items = [], sel = 0;
  const A = () => window.APP;
  const build = () => {
    const t = A().t;
    items = PAGES.map((id, i) => ({ k: String(i + 1), label: (id === 'home' ? t('nav_home') : t('nav_' + (id === 'education' ? 'edu' : id === 'terminal' ? 'term' : id))), hint: 'go /' + id, run: () => A().go(id) }));
    items.push({ k: 'L', label: t('pal_lang'), hint: 'ID / EN', run: () => A().toggleLang() });
    items.push({ k: 'M', label: t('pal_matrix'), hint: 'matrix', run: () => FX.matrix() });
  };
  const render = () => {
    const q = inp.value.trim().toLowerCase();
    const f = items.filter(i => !q || i.label.toLowerCase().includes(q) || i.hint.includes(q));
    sel = Math.min(sel, Math.max(0, f.length - 1));
    list.innerHTML = f.map((i, n) => `<li role="option" data-n="${n}" class="${n === sel ? 'sel' : ''}"><kbd>${i.k}</kbd><span>${i.label}</span><em>${i.hint}</em></li>`).join('') || '<li class="empty">…</li>';
    list._f = f;
  };
  const open = () => { build(); inp.placeholder = A().t('pal_ph'); inp.value = ''; sel = 0; box.hidden = false; render(); inp.focus(); };
  const close = () => { box.hidden = true; };
  FX.openPalette = open;
  const exec = n => { const it = list._f[n]; if (it) { close(); it.run(); } };
  inp.addEventListener('input', () => { sel = 0; render(); });
  inp.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, list._f.length - 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); exec(sel); }
  });
  list.addEventListener('click', e => { const li = e.target.closest('li[data-n]'); if (li) exec(+li.dataset.n); });
  box.addEventListener('mousedown', e => { if (e.target === box) close(); });
  $('#palBtn').addEventListener('click', open);
  addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); box.hidden ? open() : close(); return; }
    if (e.key === 'Escape') { if (!box.hidden) close(); else FX.matrix(false); return; }
    if (typing || e.ctrlKey || e.metaKey || e.altKey || !box.hidden) return;
    if (e.key === '/') { e.preventDefault(); open(); return; }
    if (/^[1-9]$/.test(e.key)) A().go(PAGES[+e.key - 1]);
  });
})();

/* ---------- 6. Cursor ring, magnetic buttons, HUD ---------- */
(function misc() {
  if (!touch && !reduce) {
    const ring = $('#ring'); let x = 0, y = 0, tx = 0, ty = 0;
    addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; ring.style.opacity = 1; });
    (function loop() { x += (tx - x) * .18; y += (ty - y) * .18; ring.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', e => ring.classList.toggle('big', !!e.target.closest('a,button,input,.card,.lab-card canvas')));
    $$('.btn,.venture').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .32}px)`;
      });
      b.addEventListener('mouseleave', () => b.style.transform = '');
    });
  }
  const clock = $('#hudClock'), fps = $('#hudFps');
  let frames = 0, last = performance.now();
  (function f() { frames++; const n = performance.now(); if (n - last >= 1000) { fps.textContent = frames; frames = 0; last = n; } requestAnimationFrame(f); })();
  const tick = () => { clock.textContent = new Date().toLocaleTimeString('en-GB'); };
  tick(); setInterval(tick, 1000);
})();

})();
