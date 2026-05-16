// LP Guia Completo de Imunização — Dra. Michelli
// Reveal (AOS) + counter + accordion + barra CTA fixa + tilt sutil.
// Hero não tem data-aos (sem animação de entrada).

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  // ---- AOS: reveal do conteúdo abaixo da dobra ----
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: 'ease-out',
      once: true,
      offset: 80,
      disableMutationObserver: true,
      disable: reduce
    });
  }

  // ---- Counter (stats 4/6/96 + preço 47) ----
  var counters = document.querySelectorAll('.count');
  if (counters.length) {
    var animate = function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      if (reduce) { el.textContent = String(target); return; }
      var duration = 1100, start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(eased * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { io.observe(c); });
  }

  // ---- Accordion FAQ (single-open, acessível) ----
  var faqBtns = document.querySelectorAll('.faq__q');
  faqBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq__item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq__item.open').forEach(function (op) {
        op.classList.remove('open');
        op.querySelector('.faq__a').style.maxHeight = null;
        op.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        var ans = item.querySelector('.faq__a');
        ans.style.maxHeight = ans.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
  window.addEventListener('resize', function () {
    var open = document.querySelector('.faq__item.open .faq__a');
    if (open) open.style.maxHeight = open.scrollHeight + 'px';
  });

  // ---- Barra CTA fixa: aparece após o hero, some sobre oferta/final ----
  var sticky = document.getElementById('stickycta');
  if (sticky) {
    var hero = document.querySelector('.hero');
    var nearCTA = false;
    var watch = ['#oferta', '#final'].map(function (s) { return document.querySelector(s); }).filter(Boolean);
    var ctaIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) nearCTA = true; });
      nearCTA = watch.some(function (el) {
        var r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
      });
      apply();
    }, { threshold: 0.01 });
    watch.forEach(function (el) { ctaIO.observe(el); });

    var apply = function () {
      var past = window.scrollY > (hero ? hero.offsetHeight * 0.9 : 600);
      sticky.classList.toggle('show', past && !nearCTA);
      sticky.setAttribute('aria-hidden', (past && !nearCTA) ? 'false' : 'true');
    };
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          nearCTA = watch.some(function (el) {
            var r = el.getBoundingClientRect();
            return r.top < window.innerHeight && r.bottom > 0;
          });
          apply();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    apply();
  }

  // ---- Tilt sutil no retrato da autoridade (desktop, não reduced-motion) ----
  if (finePointer && !reduce) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var photo = el.querySelector('.autoridade__photo');
      if (!photo) return;
      el.addEventListener('mousemove', function (ev) {
        var r = el.getBoundingClientRect();
        var rx = ((ev.clientY - r.top) / r.height - 0.5) * -4;
        var ry = ((ev.clientX - r.left) / r.width - 0.5) * 4;
        photo.style.transform = 'rotate(-2deg) perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      });
      el.addEventListener('mouseleave', function () {
        photo.style.transform = 'rotate(-2deg)';
      });
    });
  }
})();
