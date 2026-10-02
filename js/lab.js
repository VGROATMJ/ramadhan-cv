/* ============================================================
   LAB: dua demo interaktif nyata
   1) Simulator Mecanum Drive (kinematika asli)
   2) Playground Jaringan Saraf (dilatih langsung di browser)
   ============================================================ */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const labPage = $('#lab');
const isActive = () => labPage.classList.contains('active');
const t = k => (window.APP ? window.APP.t(k) : k);

/* ============================================================
   1) MECANUM
   ============================================================ */
(function mecanum() {
  const cv = $('#mecCv'), ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
  const keys = new Set();
  const bars = $('#wheelBars');
  const names = ['FL', 'FR', 'RL', 'RR'];
  bars.innerHTML = names.map(n => `<div class="wb"><span>${n}</span><div class="wb-track"><i data-w="${n}"></i></div><b data-v="${n}">0.00</b></div>`).join('');
  const bar = {}, val = {};
  names.forEach(n => { bar[n] = $(`[data-w="${n}"]`, bars); val[n] = $(`[data-v="${n}"]`, bars); });

  const r = { x: W / 2, y: H / 2, th: 0, vx: 0, vy: 0, w: 0 };
  const trail = [];
  const down = e => {
    if (!isActive() || /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName) || e.ctrlKey || e.metaKey) return;
    const k = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'q', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) { keys.add(k); e.preventDefault(); }
  };
  addEventListener('keydown', down);
  addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));
  addEventListener('blur', () => keys.clear());
  $$('#mecPad button').forEach(b => {
    const k = b.dataset.k;
    const on = e => { e.preventDefault(); keys.add(k); b.classList.add('on'); };
    const off = () => { keys.delete(k); b.classList.remove('on'); };
    b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); b.addEventListener('pointercancel', off);
  });

  const has = (...a) => a.some(k => keys.has(k));
  let last = performance.now(), auto = 0;
  function loop(now) {
    requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!isActive()) return;
    let ty = (has('w', 'arrowup') ? 1 : 0) - (has('s', 'arrowdown') ? 1 : 0);
    let tx = (has('d', 'arrowright') ? 1 : 0) - (has('a', 'arrowleft') ? 1 : 0);
    let tw = (has('e') ? 1 : 0) - (has('q') ? 1 : 0);
    // demo otomatis kalau belum ada input
    if (!keys.size) { auto += dt; if (auto > 2.5) { const p = auto * .9; ty = Math.sin(p) * .9; tx = Math.cos(p * .7) * .9; tw = Math.sin(p * .5) * .6; } } else auto = 0;
    const k = 1 - Math.pow(.0005, dt);
    r.vx += (tx - r.vx) * k; r.vy += (ty - r.vy) * k; r.w += (tw - r.w) * k;
    r.th += r.w * 2.4 * dt;
    const sp = 220;
    r.x += (Math.cos(r.th) * r.vx + Math.sin(r.th) * r.vy) * sp * dt;
    r.y += (Math.sin(r.th) * r.vx - Math.cos(r.th) * r.vy) * sp * dt;
    r.x = (r.x + W) % W; r.y = (r.y + H) % H;
    trail.push({ x: r.x, y: r.y }); if (trail.length > 140) trail.shift();

    // kinematika mecanum
    let wh = { FL: r.vy + r.vx + r.w, FR: r.vy - r.vx - r.w, RL: r.vy - r.vx + r.w, RR: r.vy + r.vx - r.w };
    const m = Math.max(1, ...Object.values(wh).map(Math.abs));
    for (const n of names) { wh[n] /= m; const v = wh[n]; val[n].textContent = (v >= 0 ? '+' : '') + v.toFixed(2); const b = bar[n]; b.style.width = Math.abs(v) * 50 + '%'; b.style.left = v >= 0 ? '50%' : (50 - Math.abs(v) * 50) + '%'; b.className = v >= 0 ? 'pos' : 'neg'; }
    draw(wh, now);
  }
  function draw(wh, now) {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(120,160,255,.12)'; ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    for (let i = 1; i < trail.length; i++) {
      const a = trail[i - 1], b = trail[i]; if (Math.hypot(a.x - b.x, a.y - b.y) > 60) continue;
      ctx.strokeStyle = `rgba(56,225,255,${i / trail.length * .6})`; ctx.lineWidth = 3 * i / trail.length + .5;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(r.th);
    ctx.shadowColor = 'rgba(47,107,255,.8)'; ctx.shadowBlur = 24;
    ctx.fillStyle = '#0a1736'; ctx.strokeStyle = '#2F6BFF'; ctx.lineWidth = 2;
    rr(-34, -46, 68, 92, 10); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(56,225,255,.5)'; ctx.setLineDash([4, 4]); rr(-22, -34, 44, 36, 5); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#FFB84D'; ctx.beginPath(); ctx.moveTo(0, -58); ctx.lineTo(10, -44); ctx.lineTo(-10, -44); ctx.fill();
    ctx.fillStyle = '#2F6BFF'; ctx.beginPath(); ctx.arc(0, 18, 11, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '700 8px "JetBrains Mono",monospace'; ctx.textAlign = 'center'; ctx.fillText('ESP32', 0, 21);
    const W4 = { FL: [-46, -38, 1], FR: [32, -38, -1], RL: [-46, 8, -1], RR: [32, 8, 1] };
    for (const n of names) {
      const [x, y, s] = W4[n], v = wh[n];
      ctx.fillStyle = '#0c1a40'; ctx.strokeStyle = v >= 0 ? '#38E1FF' : '#FFB84D'; ctx.lineWidth = 1.6;
      rr(x, y, 14, 38, 3); ctx.fill(); ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, 14, 38); ctx.clip();
      ctx.strokeStyle = v >= 0 ? 'rgba(56,225,255,.9)' : 'rgba(255,184,77,.9)'; ctx.lineWidth = 2;
      const off = (now / 60 * v * -1) % 10;
      for (let i = -4; i < 6; i++) { const yy = y + i * 10 + off; ctx.beginPath(); ctx.moveTo(x, yy + (s > 0 ? 8 : 0)); ctx.lineTo(x + 14, yy + (s > 0 ? 0 : 8)); ctx.stroke(); }
      ctx.restore();
    }
    ctx.restore();
  }
  function rr(x, y, w, h, rad) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, rad) : ctx.rect(x, y, w, h); }
  requestAnimationFrame(loop);
})();

/* ============================================================
   2) NEURAL NETWORK PLAYGROUND
   ============================================================ */
(function nn() {
  const cv = $('#nnCv'), ctx = cv.getContext('2d'), S = cv.width;
  const G = 40, off = document.createElement('canvas'); off.width = off.height = G;
  const octx = off.getContext('2d'), img = octx.createImageData(G, G);
  const gauss = () => { let u = 0; while (!u) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283 * Math.random()); };
  const feat = (x, y) => [x, y, x * x, y * y, x * y, Math.sin(3 * x), Math.sin(3 * y)];
  const sizes = [7, 8, 8, 1];
  let net, P, kind = 'spiral', running = true, epoch = 0, loss = 0, acc = 0;

  function make() {
    net = [];
    for (let l = 1; l < sizes.length; l++) {
      net.push({ w: Array.from({ length: sizes[l] }, () => Array.from({ length: sizes[l - 1] }, () => gauss() * Math.sqrt(1 / sizes[l - 1]))), b: new Array(sizes[l]).fill(0) });
    }
  }
  function forward(x) {
    const acts = [x]; let a = x;
    net.forEach((ly, li) => {
      const o = ly.w.map((row, j) => { let s = ly.b[j]; for (let i = 0; i < row.length; i++) s += row[i] * a[i]; return li === net.length - 1 ? 1 / (1 + Math.exp(-s)) : Math.tanh(s); });
      acts.push(o); a = o;
    });
    return acts;
  }
  function stepSGD(x, y, lr) {
    const acts = forward(x); let d = [acts[acts.length - 1][0] - y];
    for (let l = net.length - 1; l >= 0; l--) {
      const ly = net[l], ain = acts[l], nd = l > 0 ? new Array(ain.length).fill(0) : null;
      for (let j = 0; j < ly.w.length; j++) {
        for (let i = 0; i < ain.length; i++) { if (nd) nd[i] += ly.w[j][i] * d[j]; ly.w[j][i] -= lr * d[j] * ain[i]; }
        ly.b[j] -= lr * d[j];
      }
      if (nd) { const ao = acts[l]; for (let i = 0; i < nd.length; i++) nd[i] *= 1 - ao[i] * ao[i]; }
      d = nd;
    }
  }
  function dataset(k, n = 200) {
    const A = [];
    for (let i = 0; i < n; i++) {
      if (k === 'circle') { const inner = i % 2 === 0, rad = inner ? Math.random() * .45 : .65 + Math.random() * .3, a = Math.random() * 6.283; A.push([rad * Math.cos(a) + gauss() * .03, rad * Math.sin(a) + gauss() * .03, inner ? 1 : 0]); }
      else if (k === 'xor') { const x = Math.random() * 2 - 1, y = Math.random() * 2 - 1; A.push([x + gauss() * .03, y + gauss() * .03, x * y > 0 ? 1 : 0]); }
      else { const c = i % 2, tt = Math.random(), rad = tt * .92, a = tt * 3.2 * Math.PI + (c ? Math.PI : 0); A.push([rad * Math.cos(a) + gauss() * .03, rad * Math.sin(a) + gauss() * .03, c]); }
    }
    return A;
  }
  function reset() { make(); P = dataset(kind); epoch = 0; loss = 0; acc = 0; }
  reset();

  function trainEpoch() {
    P.sort(() => Math.random() - .5);
    for (const p of P) stepSGD(feat(p[0], p[1]), p[2], .03);
    epoch++;
    let L = 0, ok = 0;
    for (const p of P) { const o = forward(feat(p[0], p[1])).pop()[0]; L += -(p[2] * Math.log(o + 1e-9) + (1 - p[2]) * Math.log(1 - o + 1e-9)); if ((o > .5 ? 1 : 0) === p[2]) ok++; }
    loss = L / P.length; acc = ok / P.length;
  }
  function draw() {
    for (let gy = 0; gy < G; gy++) for (let gx = 0; gx < G; gx++) {
      const x = (gx + .5) / G * 2 - 1, y = (gy + .5) / G * 2 - 1;
      const o = forward(feat(x, y)).pop()[0], i = (gy * G + gx) * 4, s = Math.abs(o - .5) * 2;
      const c = o > .5 ? [56, 225, 255] : [255, 184, 77];
      img.data[i] = 8 + (c[0] - 8) * s * .75; img.data[i + 1] = 16 + (c[1] - 16) * s * .75; img.data[i + 2] = 40 + (c[2] - 40) * s * .75; img.data[i + 3] = 255;
    }
    octx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(off, 0, 0, S, S);
    for (const p of P) {
      const x = (p[0] + 1) / 2 * S, y = (p[1] + 1) / 2 * S;
      ctx.beginPath(); ctx.arc(x, y, 4.2, 0, 6.283);
      ctx.fillStyle = p[2] ? '#38E1FF' : '#FFB84D'; ctx.fill();
      ctx.strokeStyle = '#040A18'; ctx.lineWidth = 1.5; ctx.stroke();
    }
    $('#nnEp').textContent = epoch; $('#nnLoss').textContent = loss ? loss.toFixed(3) : '–'; $('#nnAcc').textContent = epoch ? Math.round(acc * 100) + '%' : '–';
  }
  (function loop() {
    requestAnimationFrame(loop);
    if (!isActive()) return;
    if (running) trainEpoch();
    draw();
  })();

  const tog = $('#nnToggle');
  const setTog = () => { tog.dataset.i18n = running ? 'nn_pause' : 'nn_train'; tog.textContent = t(tog.dataset.i18n); };
  tog.addEventListener('click', () => { running = !running; setTog(); });
  $('#nnReset').addEventListener('click', () => { reset(); running = true; setTog(); });
  $$('.ds').forEach(b => b.addEventListener('click', () => {
    kind = b.dataset.ds; $$('.ds').forEach(x => x.classList.toggle('on', x === b)); reset(); running = true; setTog();
  }));
})();

})();
