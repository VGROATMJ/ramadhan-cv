(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const CFG = window.CONFIG || {};

/* ============================================================
   i18n
   ============================================================ */
const I18N = {
  id: {
    nav_about:'Tentang', nav_skills:'Skill', nav_projects:'Proyek', nav_company:'Perusahaan', nav_edu:'Pendidikan', nav_term:'Terminal', nav_contact:'Kontak',
    vent:'Pendiri PT Vigaro Atmajaya (dalam perencanaan)',
    co_h:'Perusahaan teknologi yang sedang kurencanakan', co_sub:'Dari proyek kuliah menuju produk dan layanan nyata.', co_status:'Tahap perencanaan',
    co_p1:'PT Vigaro Atmajaya adalah rencana perusahaan teknologi yang ingin kubangun. Tujuannya mengubah pengalaman di proyek AI, robotika, IoT, dan web menjadi produk dan layanan yang berguna bagi bisnis dan masyarakat.',
    co_p2:'Saat ini perusahaan ini masih dalam tahap perencanaan. Semua yang kubangun di bagian Proyek menjadi fondasinya.', co_founder:'Pendiri',
    f1_h:'Solusi AI & Data', f1_p:'Sistem prediksi dan analisis data untuk kebutuhan nyata, seperti yang dibangun di Lacta-Predict.',
    f2_h:'Robotika & IoT', f2_p:'Perangkat pintar, robot, dan smart home berbasis ESP32 dan layanan cloud.',
    f3_h:'Web & Software', f3_p:'Website dan aplikasi yang dibangun, di-deploy, dan dirawat sampai benar-benar online.',
    rm_h:'Rencana tahapan', rm1:'Riset & konsep', rm1s:'Sedang berjalan', rm2:'Prototipe produk', rm2s:'Berikutnya', rm3:'Legalitas & pendirian', rm3s:'Direncanakan', rm4:'Peluncuran', rm4s:'Direncanakan',
    t_company:'PT Vigaro Atmajaya — rencana perusahaan teknologi (AI, robotika & IoT, web).\nPendiri: Ramadhan Tri Atmojo. Status: tahap perencanaan.',
    status:'Mahasiswa AI di IPB University',
    hero_lead:'Aku belajar kecerdasan buatan sambil membuat sesuatu: dari model prediksi dan robot ESP32 sampai perangkat suara pintar dan website yang benar-benar online.',
    cta_projects:'Lihat proyek', cta_contact:'Hubungi aku',
    stat_proj:'proyek unggulan', stat_dom:'bidang: AI, robotika, IoT, web', stat_int:'area yang kupelajari',
    about_h:'Orang di balik kodenya', about_sub:'AI student, builder, technology enthusiast.',
    about_p1:'Aku Ramadhan Tri Atmojo, mahasiswa Kecerdasan Buatan di IPB University, Sekolah Sains Data, Matematika dan Ilmu Komputer. Aku tertarik pada AI, data, robotika, IoT, dan pengembangan software.',
    about_p2:'Aku paling senang mengubah ide jadi teknologi yang bisa dipakai lewat proyek langsung: sistem machine learning, robot cerdas, perangkat berbasis AI, sampai aplikasi web.',
    skills_h:'Tumpukan teknologiku', skills_sub:'Arahkan kursor ke orbit untuk menjeda, atau lihat daftarnya di sebelah.',
    sk_deploy:'Konsep AI & deployment', sk_sensor:'Sensor & aktuator', sk_cloud:'Layanan AI cloud', sk_domain:'Domain & hosting',
    proj_h:'Hal-hal yang sudah kubangun', proj_sub:'Empat proyek, empat sisi teknologi.',
    p1_desc:'Sistem prediksi produksi susu sapi perah berbasis data tabular. Mencakup preprocessing, EDA, feature engineering, dan evaluasi model.',
    p2_desc:'Konsep robot transporter beroda mecanum berbasis ESP32, dengan beberapa motor, servo, gripper, dan sistem lift. Dikendalikan lewat PS3 controller.',
    p3_desc:'Perangkat berbasis ESP32 yang menggabungkan input suara, speaker, Wi-Fi, relay untuk smart home, dan layanan AI di cloud.',
    p4_desc:'Website company profile multi-halaman dengan UI responsif, dibangun dengan HTML, CSS, dan JavaScript, lalu di-deploy lewat GitHub dan Vercel dengan domain sendiri.',
    edu_h:'Pendidikan', edu_sub:'Tempat aku belajar membangun AI.',
    edu_deg:'Kecerdasan Buatan (Artificial Intelligence)', edu_school:'Sekolah Sains Data, Matematika dan Ilmu Komputer', edu_now:'Mahasiswa aktif',
    next_h:'Sedang kukerjakan', next_p:'Memperdalam machine learning dan deployment AI, sambil terus membangun proyek robotika, IoT, dan web.',
    term_h:'Coba terminalku', term_sub:'Ketik <code>help</code> lalu tekan Enter.',
    contact_h:'Mari bikin sesuatu bareng.', contact_p:'Terbuka untuk kolaborasi proyek, lomba, magang, dan diskusi seputar AI, robotika, dan web.',
    foot:'Dibangun dengan HTML, CSS, dan JavaScript',
    t_help:'Perintah yang tersedia', t_unknown:'perintah tidak dikenal. Ketik help untuk daftar perintah.',
    t_about:'Ramadhan Tri Atmojo — mahasiswa Kecerdasan Buatan, IPB University.\nSuka mengubah ide jadi teknologi lewat proyek langsung.',
    t_none:'(belum diisi)', t_hire:'Permintaan diterima. Mengirim sinyal ke Ramadhan... ✔\nSilakan lanjut ke bagian Kontak.'
  },
  en: {
    nav_about:'About', nav_skills:'Skills', nav_projects:'Projects', nav_company:'Company', nav_edu:'Education', nav_term:'Terminal', nav_contact:'Contact',
    vent:'Founder of PT Vigaro Atmajaya (in planning)',
    co_h:'The tech company I’m planning', co_sub:'From student projects to real products and services.', co_status:'Planning stage',
    co_p1:'PT Vigaro Atmajaya is a technology company I plan to build. The goal is to turn my experience in AI, robotics, IoT, and web projects into products and services that are useful to businesses and communities.',
    co_p2:'The company is still in the planning stage. Everything I build in the Projects section forms its foundation.', co_founder:'Founder',
    f1_h:'AI & Data Solutions', f1_p:'Prediction and data analysis systems for real needs, like the work behind Lacta-Predict.',
    f2_h:'Robotics & IoT', f2_p:'Smart devices, robots, and smart home systems built on ESP32 and cloud services.',
    f3_h:'Web & Software', f3_p:'Websites and apps that are built, deployed, and maintained until they are truly live.',
    rm_h:'Roadmap', rm1:'Research & concept', rm1s:'In progress', rm2:'Product prototype', rm2s:'Next', rm3:'Legal setup & incorporation', rm3s:'Planned', rm4:'Launch', rm4s:'Planned',
    t_company:'PT Vigaro Atmajaya — a planned technology company (AI, robotics & IoT, web).\nFounder: Ramadhan Tri Atmojo. Status: planning stage.',
    status:'AI student at IPB University',
    hero_lead:'I study artificial intelligence by building things: from prediction models and ESP32 robots to smart voice devices and websites that are actually live.',
    cta_projects:'View projects', cta_contact:'Get in touch',
    stat_proj:'featured projects', stat_dom:'domains: AI, robotics, IoT, web', stat_int:'areas I explore',
    about_h:'The person behind the code', about_sub:'AI student, builder, technology enthusiast.',
    about_p1:'I’m Ramadhan Tri Atmojo, an Artificial Intelligence student at IPB University’s School of Data Science, Mathematics and Computer Science. I’m interested in AI, data, robotics, IoT, and software development.',
    about_p2:'I enjoy turning ideas into practical technology through hands-on projects: machine learning systems, intelligent robots, AI-powered devices, and web applications.',
    skills_h:'My tech stack', skills_sub:'Hover the orbit to pause it, or browse the list beside it.',
    sk_deploy:'AI concepts & deployment', sk_sensor:'Sensors & actuators', sk_cloud:'Cloud AI services', sk_domain:'Domain & hosting',
    proj_h:'Things I’ve built', proj_sub:'Four projects, four sides of technology.',
    p1_desc:'A dairy cow milk production prediction system built on tabular data. Covers preprocessing, EDA, feature engineering, and model evaluation.',
    p2_desc:'A mecanum-wheel transporter robot concept powered by ESP32, with multiple motors, servos, a gripper, and a lift system. Driven by a PS3 controller.',
    p3_desc:'An ESP32-based device combining voice input, a speaker, Wi-Fi, relays for smart home control, and cloud AI services.',
    p4_desc:'A multi-page company profile website with a responsive UI, built with HTML, CSS, and JavaScript, then deployed through GitHub and Vercel on a custom domain.',
    edu_h:'Education', edu_sub:'Where I’m learning to build AI.',
    edu_deg:'Artificial Intelligence', edu_school:'School of Data Science, Mathematics and Computer Science', edu_now:'Active student',
    next_h:'Currently working on', next_p:'Going deeper into machine learning and AI deployment while continuing to build robotics, IoT, and web projects.',
    term_h:'Try my terminal', term_sub:'Type <code>help</code> and press Enter.',
    contact_h:'Let’s build something together.', contact_p:'Open to project collaborations, competitions, internships, and conversations about AI, robotics, and the web.',
    foot:'Built with HTML, CSS, and JavaScript',
    t_help:'Available commands', t_unknown:'command not found. Type help for the list.',
    t_about:'Ramadhan Tri Atmojo — Artificial Intelligence student, IPB University.\nLikes turning ideas into technology through hands-on projects.',
    t_none:'(not set yet)', t_hire:'Request received. Sending a signal to Ramadhan... ✔\nHead to the Contact section.'
  }
};
let lang = localStorage.getItem('lang') || 'id';
const t = k => (I18N[lang] && I18N[lang][k]) || k;

function applyLang() {
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach(el => {
    const txt = t(el.dataset.i18n);
    if (el.classList.contains('split')) {
      el.innerHTML = '<span>' + txt + '</span>';
    } else if (txt.includes('<')) {
      el.innerHTML = txt;
    } else {
      el.textContent = txt;
    }
  });
  $$('#lang span').forEach((s, i) => s.classList.toggle('on', (i === 0) === (lang === 'id')));
  renderInterests();
  renderContact();
  resetTyped();
}
$('#lang').addEventListener('click', () => {
  lang = lang === 'id' ? 'en' : 'id';
  localStorage.setItem('lang', lang);
  applyLang();
  // keep headings revealed
  $$('.split').forEach(el => el.classList.add('in'));
});

/* ============================================================
   Boot sequence
   ============================================================ */
const bootLines = [
  '> booting portfolio.os ...',
  '> loading neural_net.js .......... ok',
  '> mounting esp32.drivers ......... ok',
  '> connecting ipb.university ....... ok',
  '> hello, visitor.'
];
function boot() {
  const log = $('#bootLog'), fill = $('#bootFill'), el = $('#boot');
  if (reduce) { el.classList.add('done'); startHero(); return; }
  let i = 0;
  (function next() {
    if (i < bootLines.length) {
      log.textContent += bootLines[i] + '\n';
      fill.style.width = ((i + 1) / bootLines.length * 100) + '%';
      i++; setTimeout(next, 330);
    } else {
      setTimeout(() => { el.classList.add('done'); startHero(); }, 450);
    }
  })();
}
function startHero() {
  document.body.classList.add('boot-glitch');
  setTimeout(() => document.body.classList.remove('boot-glitch'), 1300);
  resetTyped();
  countUp();
}

/* ============================================================
   Typed roles
   ============================================================ */
const roles = {
  id: ['AI Student di IPB University', 'Machine Learning Builder', 'Robotics & IoT Tinkerer', 'Web Developer', 'Technology Enthusiast'],
  en: ['AI Student at IPB University', 'Machine Learning Builder', 'Robotics & IoT Tinkerer', 'Web Developer', 'Technology Enthusiast']
};
let typeTimer = null;
function resetTyped() {
  clearTimeout(typeTimer);
  const el = $('#typed'); if (!el) return;
  if (reduce) { el.textContent = roles[lang][0]; return; }
  let r = 0, c = 0, del = false;
  (function tick() {
    const word = roles[lang][r];
    el.textContent = word.slice(0, c);
    let d = del ? 28 : 70;
    if (!del && c === word.length) { del = true; d = 1500; }
    else if (del && c === 0) { del = false; r = (r + 1) % roles[lang].length; d = 350; }
    else c += del ? -1 : 1;
    typeTimer = setTimeout(tick, d);
  })();
}

/* ============================================================
   Counters
   ============================================================ */
function countUp() {
  $$('[data-count]').forEach(el => {
    const n = +el.dataset.count; let v = 0;
    if (reduce) { el.textContent = n; return; }
    const iv = setInterval(() => { v++; el.textContent = v; if (v >= n) clearInterval(iv); }, 180);
  });
}

/* ============================================================
   Neural network background
   ============================================================ */
(function network() {
  const cv = $('#net'), ctx = cv.getContext('2d');
  let W, H, nodes = [], pulses = [], mouse = { x: -999, y: -999 };
  const DPR = Math.min(devicePixelRatio || 1, 2);
  function size() {
    W = cv.width = innerWidth * DPR; H = cv.height = innerHeight * DPR;
    cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
    const n = Math.min(110, Math.floor(innerWidth * innerHeight / 17000));
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .35 * DPR, vy: (Math.random() - .5) * .35 * DPR,
      r: (Math.random() * 1.6 + .8) * DPR, hue: Math.random() < .15 ? 'a' : 'c'
    }));
  }
  size(); addEventListener('resize', size);
  addEventListener('mousemove', e => { mouse.x = e.clientX * DPR; mouse.y = e.clientY * DPR; });
  addEventListener('mouseleave', () => { mouse.x = mouse.y = -999; });
  const LINK = 150 * DPR;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
      if (d < 180 * DPR) { n.x += dx * .006; n.y += dy * .006; }
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(80,140,255,${(1 - d / LINK) * .35})`;
          ctx.lineWidth = DPR * .8;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          if (Math.random() < .0009 && pulses.length < 18) pulses.push({ a, b, p: 0 });
        }
      }
      const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (md < 200 * DPR) {
        ctx.strokeStyle = `rgba(56,225,255,${(1 - md / (200 * DPR)) * .6})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = a.hue === 'a' ? '#FFB84D' : '#38E1FF';
      ctx.globalAlpha = .85;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283); ctx.fill();
      ctx.globalAlpha = 1;
    }
    pulses = pulses.filter(p => (p.p += .02) < 1);
    for (const p of pulses) {
      const x = p.a.x + (p.b.x - p.a.x) * p.p, y = p.a.y + (p.b.y - p.a.y) * p.p;
      ctx.fillStyle = '#fff'; ctx.shadowColor = '#38E1FF'; ctx.shadowBlur = 14 * DPR;
      ctx.beginPath(); ctx.arc(x, y, 2.4 * DPR, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
    }
    requestAnimationFrame(frame);
  }
  if (!reduce) frame();
})();

/* Cursor glow */
(function () {
  const g = $('#glow');
  addEventListener('mousemove', e => { g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; });
  if (matchMedia('(hover: none)').matches) g.style.display = 'none';
})();

/* Scroll progress + mobile menu */
(function () {
  const bar = $('#progress'), burger = $('#burger'), nav = $('#links');
  addEventListener('scroll', () => {
    const h = document.documentElement, m = h.scrollHeight - h.clientHeight;
    bar.style.width = (m > 0 ? h.scrollTop / m * 100 : 0) + '%';
  }, { passive: true });
  burger.addEventListener('click', () => nav.classList.toggle('open'));
})();

/* ============================================================
   Page router: click a menu item and the whole page switches
   ============================================================ */
const pages = $$('.page');
const pageIds = pages.map(p => p.id);
let current = 'home', busy = false, pending = null;

function show(id) {
  pages.forEach(p => p.classList.toggle('active', p.id === id));
  current = id;
  window.scrollTo(0, 0);
  $$('.links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  $('#links').classList.remove('open');
}
function route(id, animate = true) {
  if (!pageIds.includes(id)) id = 'home';
  if (busy) { pending = id; return; }
  if (id === current) return;
  if (reduce || !animate) { show(id); return; }
  busy = true;
  const w = $('#wipe'); $('#wipeText').textContent = '> load("' + id + '")';
  w.style.display = 'grid';
  const ease = 'cubic-bezier(.7,0,.3,1)';
  const a = w.animate([{ transform: 'translateX(-101%)' }, { transform: 'translateX(0)' }], { duration: 300, easing: ease, fill: 'forwards' });
  a.onfinish = () => {
    show(id);
    setTimeout(() => {
      const b = w.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(101%)' }], { duration: 380, easing: ease, fill: 'forwards' });
      b.onfinish = () => {
        w.style.display = 'none'; a.cancel(); b.cancel(); busy = false;
        if (pending) { const n = pending; pending = null; route(n); }
      };
    }, 120);
  };
}
function go(id) { if (location.hash === '#' + id) route(id); else location.hash = id; }
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  if (!pageIds.includes(id)) return;
  e.preventDefault(); go(id);
});
addEventListener('hashchange', () => route(location.hash.slice(1) || 'home'));
if (pageIds.includes(location.hash.slice(1))) show(location.hash.slice(1));

/* ============================================================
   Render helpers: interests, marquee, orbit
   ============================================================ */
function renderInterests() {
  const list = ['Artificial Intelligence', 'Machine Learning', 'Data Science', 'Robotics', 'Internet of Things', 'Software Engineering', 'Web Development'];
  $('#interest').innerHTML = list.map(x => `<span>${x}</span>`).join('');
}
(function marquee() {
  const items = ['Machine Learning', 'ESP32', 'Arduino', 'IoT', 'Data Science', 'Mecanum Robot', 'HTML', 'CSS', 'JavaScript', 'GitHub', 'Vercel', 'Voice Assistant', 'Smart Home', 'Model Evaluation', 'Feature Engineering', 'PT Vigaro Atmajaya'];
  const html = items.map(x => `<span>${x}</span>`).join('');
  $('#marquee').innerHTML = html + html;
})();
(function orbit() {
  const o = $('#orbit');
  const rings = [
    { d: 38, dur: 22, items: ['ML', 'EDA', 'Data', 'AI'] },
    { d: 66, dur: 34, items: ['ESP32', 'Arduino', 'Servo', 'Motor', 'Sensor'] },
    { d: 94, dur: 48, items: ['HTML', 'CSS', 'JS', 'GitHub', 'Vercel', 'IoT'] }
  ];
  rings.forEach((r, ri) => {
    const ring = document.createElement('div');
    ring.className = 'o-ring';
    ring.style.cssText = `width:${r.d}%;aspect-ratio:1;margin:-${r.d / 2}% 0 0 -${r.d / 2}%;animation-duration:${r.dur}s;${ri === 1 ? 'animation-direction:reverse;' : ''}`;
    r.items.forEach((txt, i) => {
      const a = i / r.items.length * Math.PI * 2;
      const it = document.createElement('div');
      it.className = 'o-item';
      it.style.left = (50 + 50 * Math.cos(a)) + '%';
      it.style.top = (50 + 50 * Math.sin(a)) + '%';
      const sp = document.createElement('span');
      sp.textContent = txt;
      sp.style.animationDuration = r.dur + 's';
      if (ri === 1) sp.style.animationDirection = 'normal';
      it.appendChild(sp); ring.appendChild(it);
    });
    o.appendChild(ring);
  });
})();

/* Robot (mecanum) SVG */
(function robot() {
  const wheel = (x, y, slant) => {
    const id = 'w' + x + y;
    let lines = '';
    for (let i = -2; i < 6; i++) {
      const yy = i * 14;
      lines += slant > 0 ? `<line x1="0" y1="${yy + 14}" x2="22" y2="${yy}"/>` : `<line x1="0" y1="${yy}" x2="22" y2="${yy + 14}"/>`;
    }
    return `<g transform="translate(${x},${y})"><clipPath id="${id}"><rect width="22" height="46" rx="4"/></clipPath>
      <rect width="22" height="46" rx="4" fill="#0c1a40" stroke="#38E1FF" stroke-width="1.5"/>
      <g clip-path="url(#${id})"><g class="stripes" stroke="#FFB84D" stroke-width="2.5">${lines}</g></g></g>`;
  };
  $('#robotViz').insertAdjacentHTML('afterbegin', `
    <svg viewBox="0 0 200 170" aria-hidden="true">
      ${wheel(18, 18, -1)}${wheel(160, 18, 1)}${wheel(18, 108, 1)}${wheel(160, 108, -1)}
      <rect x="46" y="22" width="108" height="126" rx="12" fill="#0a1736" stroke="#2F6BFF" stroke-width="2"/>
      <rect x="62" y="40" width="76" height="40" rx="6" fill="none" stroke="#38E1FF" stroke-dasharray="4 4"/>
      <circle cx="100" cy="112" r="14" fill="#2F6BFF"><animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite"/></circle>
      <text x="100" y="116" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace" font-weight="700">ESP32</text>
      <path d="M86 14 L100 0 L114 14" fill="none" stroke="#FFB84D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`);
})();

/* Voice wave bars */
(function wave() {
  const w = $('#wave');
  for (let i = 0; i < 28; i++) {
    const b = document.createElement('i');
    b.style.animationDelay = (-Math.random() * 1.2).toFixed(2) + 's';
    b.style.animationDuration = (0.7 + Math.random() * .8).toFixed(2) + 's';
    w.appendChild(b);
  }
})();

/* Typed web code */
(function webCode() {
  const el = $('#webCode');
  const lines = [
    '<span class="hero">',
    '  <h1>SAM Legal Prima</h1>',
    '  <nav> beranda | layanan </nav>',
    '</span>',
    '// push → github',
    '// deploy → vercel ✔ live'
  ].join('\n');
  if (reduce) { el.textContent = lines; return; }
  let i = 0;
  (function tick() {
    el.textContent = lines.slice(0, i) + '▌';
    i++;
    if (i > lines.length + 22) i = 0;
    setTimeout(tick, i === 0 ? 400 : 60);
  })();
})();

/* ============================================================
   Contact
   ============================================================ */
function renderContact() {
  const box = $('#contactLinks'); const out = [];
  if (CFG.email) out.push(`<a class="btn primary" href="mailto:${CFG.email}">Email</a>`);
  if (CFG.linkedin) out.push(`<a class="btn ghost" href="${CFG.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`);
  if (CFG.github) out.push(`<a class="btn ghost" href="${CFG.github}" target="_blank" rel="noopener">GitHub</a>`);
  if (CFG.instagram) out.push(`<a class="btn ghost" href="${CFG.instagram}" target="_blank" rel="noopener">Instagram</a>`);
  if (CFG.cvPdf) out.push(`<a class="btn ghost" href="${CFG.cvPdf}" download>${lang === 'id' ? 'Unduh CV' : 'Download CV'}</a>`);
  box.innerHTML = out.length ? out.join('') : `<span class="none">${lang === 'id' ? 'Kontak segera hadir.' : 'Contact details coming soon.'}</span>`;
}

/* ============================================================
   Terminal
   ============================================================ */
(function terminal() {
  const body = $('#termBody'), form = $('#termForm'), inp = $('#termInput'), quick = $('#termQuick');
  const cmds = ['help', 'about', 'skills', 'projects', 'company', 'education', 'contact', 'clear'];
  quick.innerHTML = cmds.map(c => `<button type="button" data-c="${c}">${c}</button>`).join('');
  const print = (html, cls = 'out') => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; body.appendChild(d); body.scrollTop = body.scrollHeight; };
  const run = raw => {
    const c = raw.trim().toLowerCase();
    if (!c) return;
    print(`<b>ramadhan@ipb:~$</b> ${c.replace(/</g, '&lt;')}`, 'cmd');
    switch (c) {
      case 'help': print(`${t('t_help')}:\n  <span class="hl">about</span>      \n  <span class="hl">skills</span>\n  <span class="hl">projects</span>\n  <span class="hl">company</span>\n  <span class="hl">education</span>\n  <span class="hl">contact</span>\n  <span class="hl">clear</span>`); break;
      case 'about': case 'whoami': print(t('t_about')); break;
      case 'skills': print('AI/Data   : Machine Learning, EDA, Feature Engineering, Model Evaluation\nRobotics  : ESP32, Arduino, Motor control, Servo, Mecanum\nIoT       : Wi-Fi, Relay, Voice input, Cloud AI\nWeb       : HTML, CSS, JavaScript, GitHub, Vercel'); break;
      case 'projects': case 'ls': print('<span class="hl">Lacta-Predict</span>       AI & ML\n<span class="hl">ESP32 Mecanum Robot</span> Robotics\n<span class="hl">AIVA Voice Assistant</span> AI & IoT\n<span class="hl">SAM Legal Prima</span>    Web'); break;
      case 'company': print(t('t_company')); break;
      case 'education': print('IPB University\n' + (lang === 'id' ? 'Kecerdasan Buatan — Sekolah Sains Data, Matematika dan Ilmu Komputer' : 'Artificial Intelligence — School of Data Science, Mathematics and Computer Science')); break;
      case 'contact': {
        const l = ['email', 'linkedin', 'github', 'instagram'].filter(k => CFG[k]).map(k => `${k.padEnd(10)}: ${CFG[k]}`);
        print(l.length ? l.join('\n') : t('t_none')); break;
      }
      case 'clear': body.innerHTML = ''; break;
      case 'sudo hire ramadhan': print(t('t_hire'), 'out hl'); setTimeout(() => go('contact'), 900); break;
      default: print(`${c.split(' ')[0]}: ${t('t_unknown')}`);
    }
  };
  form.addEventListener('submit', e => { e.preventDefault(); run(inp.value); inp.value = ''; });
  quick.addEventListener('click', e => { const b = e.target.closest('button'); if (b) run(b.dataset.c); });
  print('ramadhan.os v1.0 — type <span class="hl">help</span>');
})();

/* ============================================================
   Tilt + reveal
   ============================================================ */
(function tilt() {
  if (reduce || matchMedia('(hover: none)').matches) return;
  $$('.tilt').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
    });
    c.addEventListener('mouseleave', () => c.style.transform = '');
  });
  const hud = $('#hud'), fr = $('.frame');
  hud.addEventListener('mousemove', e => {
    const r = hud.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    fr.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 10}deg)`;
  });
  hud.addEventListener('mouseleave', () => fr.style.transform = '');
})();

(function reveal() {
  $$('.card,.sg,.node-body,.about-text,.about-photo,.edu-photo,.term,.contact-box,.co-logo,.co-text,.fc,.rm-step').forEach(el => el.classList.add('rv'));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { const t = e.target; t.classList.add('in'); io.unobserve(t); if (t.classList.contains('rv')) setTimeout(() => t.classList.remove('rv'), 1000); }
  }), { threshold: .15 });
  $$('.rv,.split').forEach(el => io.observe(el));
})();

$('#year').textContent = new Date().getFullYear();
applyLang();
boot();
})();
