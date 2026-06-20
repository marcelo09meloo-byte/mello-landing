const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

const WHATSAPP_NUMBER = '5571983801169';
const WHATSAPP_MESSAGES = {
  nav: 'Olá! Vim através do site da Mello.ads e gostaria de conversar com um especialista sobre crescimento digital.',
  hero: 'Olá! Vim através do site da Mello.ads e gostaria de aumentar minhas vendas com tráfego pago.',
  portfolio: 'Olá! Vi os projetos da Mello.ads e quero entender qual solução combina melhor com a minha empresa.',
  trafego: 'Olá! Tenho interesse em Gestão de Tráfego Pago para minha empresa e gostaria de um diagnóstico gratuito.',
  meta_ads: 'Olá! Quero atrair clientes mais qualificados com Meta Ads e gostaria de uma análise para minha empresa.',
  google_ads: 'Olá! Tenho interesse em campanhas no Google Ads para captar clientes com intenção de compra.',
  landing_pages: 'Olá! Quero criar uma Landing Page profissional de alta conversão para meu negócio.',
  sites: 'Olá! Gostaria de desenvolver um site profissional para minha empresa.',
  social_media: 'Olá! Tenho interesse em melhorar minhas redes sociais e gostaria de receber uma proposta.',
  branding: 'Olá! Quero criar ou fortalecer a identidade visual da minha empresa.',
  consultoria: 'Olá! Gostaria de uma consultoria para encontrar oportunidades de crescimento no marketing da minha empresa.',
  automacao: 'Olá! Quero automatizar meu atendimento e melhorar a conversão dos contatos que chegam pelo WhatsApp.',
  cta_final: 'Olá! Gostaria de conversar com um especialista da Mello.ads e solicitar um orçamento.',
  float: 'Olá! Vim através do site da Mello.ads e gostaria de falar com um especialista.'
};

const buildWhatsAppUrl = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const header = $('[data-header]');
const toggle = $('.nav-toggle');
const menu = $('.nav-menu');

addEventListener('scroll', () => header?.classList.toggle('scrolled', scrollY > 18), { passive: true });
toggle?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
$$('.nav-menu a').forEach((anchor) => anchor.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
}));

const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    io.unobserve(entry.target);
  }
}), { threshold: 0.16 });
$$('.reveal').forEach((element) => io.observe(element));

const cursor = $('.cursor');
addEventListener('pointermove', (event) => {
  if (cursor) cursor.style.translate = `${event.clientX - 9}px ${event.clientY - 9}px`;
}, { passive: true });

const canvas = $('#network');
const ctx = canvas?.getContext('2d');
let pts = [];
function size() {
  if (!canvas) return;
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  pts = Array.from({ length: Math.min(70, Math.floor(innerWidth / 18)) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45
  }));
}
function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pts.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.fillStyle = 'rgba(98,231,255,.75)';
    ctx.beginPath(); ctx.arc(p.x, p.y, 2 * devicePixelRatio, 0, Math.PI * 2); ctx.fill();
    for (let j = i + 1; j < pts.length; j += 1) {
      const q = pts[j];
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 170 * devicePixelRatio) {
        ctx.strokeStyle = `rgba(28,125,255,${1 - d / (170 * devicePixelRatio)})`;
        ctx.lineWidth = 0.6 * devicePixelRatio;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
    }
  });
  requestAnimationFrame(draw);
}
size(); draw(); addEventListener('resize', size, { passive: true });

$('.lead-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const feedback = $('.form-feedback', form);
  if (!form.checkValidity()) {
    feedback.textContent = 'Revise os campos destacados para continuar.';
    form.reportValidity();
    return;
  }
  const data = Object.fromEntries(new FormData(form));
  const msg = `Olá! Sou ${data.nome} da empresa ${data.empresa}. Meu telefone é ${data.telefone}. ${data.mensagem}`;
  feedback.textContent = 'Tudo certo. Abrindo WhatsApp...';
  open(buildWhatsAppUrl(msg), '_blank', 'noopener');
});

$$('[data-whatsapp]').forEach((button) => {
  const intent = button.dataset.whatsappIntent || 'float';
  button.href = buildWhatsAppUrl(WHATSAPP_MESSAGES[intent] || WHATSAPP_MESSAGES.float);
  button.target = '_blank';
  button.rel = 'noopener';
  button.addEventListener('click', () => {
    button.animate([{ transform: 'scale(1)' }, { transform: 'scale(.94)' }, { transform: 'scale(1)' }], { duration: 260 });
  });
});

$$('[data-carousel]').forEach((carousel) => {
  const viewport = $('.carousel-viewport', carousel);
  const track = $('[data-carousel-track]', carousel);
  const cards = $$('.service-card', carousel);
  const prev = $('[data-carousel-prev]', carousel);
  const next = $('[data-carousel-next]', carousel);
  if (!viewport || !track || !cards.length) return;

  let index = 0;
  let startX = 0;
  let currentX = 0;
  let dragStartOffset = 0;
  let offset = 0;
  let dragging = false;

  const gap = () => parseFloat(getComputedStyle(track).gap) || 22;
  const step = () => cards[0].getBoundingClientRect().width + gap();
  const maxIndex = () => Math.max(0, cards.length - Math.max(1, Math.floor(viewport.clientWidth / step())));
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const render = (instant = false) => {
    index = clamp(index, 0, maxIndex());
    offset = -index * step();
    track.style.transition = instant ? 'none' : '';
    track.style.transform = `translate3d(${offset}px,0,0)`;
    cards.forEach((card, cardIndex) => {
      const distance = Math.abs(cardIndex - index);
      card.style.transform = `rotateY(${cardIndex < index ? 10 : -10}deg) translateZ(${-Math.min(distance, 3) * 18}px) scale(${1 - Math.min(distance, 3) * 0.035})`;
      card.style.opacity = distance > 4 ? '0.58' : '1';
    });
    if (instant) requestAnimationFrame(() => { track.style.transition = ''; });
  };

  const moveTo = (nextIndex) => {
    index = clamp(nextIndex, 0, maxIndex());
    render();
  };

  const onPointerDown = (event) => {
    dragging = true;
    startX = event.clientX;
    currentX = startX;
    dragStartOffset = offset;
    viewport.classList.add('dragging');
    track.style.transition = 'none';
    viewport.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!dragging) return;
    currentX = event.clientX;
    const delta = currentX - startX;
    track.style.transform = `translate3d(${dragStartOffset + delta}px,0,0)`;
  };

  const onPointerUp = (event) => {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove('dragging');
    viewport.releasePointerCapture?.(event.pointerId);
    const delta = currentX - startX;
    const threshold = Math.min(120, step() * 0.26);
    if (delta < -threshold) moveTo(index + 1);
    else if (delta > threshold) moveTo(index - 1);
    else render();
  };

  prev?.addEventListener('click', () => moveTo(index - 1));
  next?.addEventListener('click', () => moveTo(index + 1));
  viewport.addEventListener('pointerdown', onPointerDown);
  viewport.addEventListener('pointermove', onPointerMove);
  viewport.addEventListener('pointerup', onPointerUp);
  viewport.addEventListener('pointercancel', onPointerUp);
  addEventListener('resize', () => render(true), { passive: true });
  render(true);
});
