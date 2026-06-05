
// ── CURSOR ──
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animCursor() {
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  rx += (mx - rx) * .15; ry += (my - ry) * .15;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a,button,.pill,.skill-tag,.project-card,.cert-card,.ach-item,.stat-card,.skill-category').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// ── HOVERBOARD CANVAS (particle trail) ──
const canvas = document.getElementById('hoverboard-canvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;
window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

const particles = [];
const COLORS = ['#63d2ff','#7b5ea7','#ff6b6b','#63ffd2','#ffd263'];

class Particle {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.vx = (Math.random() - .5) * 1.5;
    this.vy = (Math.random() - .5) * 1.5 - .5;
    this.alpha = Math.random() * .5 + .3;
    this.r = Math.random() * 3 + 1;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.life = 1;
    this.decay = Math.random() * .02 + .012;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vy += .02;
    this.life -= this.decay;
    this.alpha = this.life * .6;
    this.r *= .97;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

let lastX = 0, lastY = 0;
document.addEventListener('mousemove', e => {
  const dx = e.clientX - lastX, dy = e.clientY - lastY;
  const speed = Math.sqrt(dx*dx + dy*dy);
  const count = Math.min(Math.floor(speed / 4), 5);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(e.clientX + (Math.random()-0.5)*6, e.clientY + (Math.random()-0.5)*6));
  }
  lastX = e.clientX; lastY = e.clientY;
});

function drawLoop() {
  ctx.clearRect(0, 0, W, H);
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].life <= 0) particles.splice(i, 1);
  }
  requestAnimationFrame(drawLoop);
}
drawLoop();

// ── PROJECT CARD RADIAL GLOW ──
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
  });
});

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
