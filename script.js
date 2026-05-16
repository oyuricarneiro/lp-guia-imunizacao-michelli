// LP Guia Completo de Imunização — Dra. Michelli
// Reveal nativo (sem libs) + counter + accordion + barra CTA fixa + tilt.
// Hero não tem data-aos (sem animação de entrada).

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  // ---- Reveal on scroll (substitui o AOS) ----
  var revealEls = document.querySelectorAll('[data-aos]');
  if (revealEls.length) {
    if (reduce) {
      revealEls.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      document.documentElement.classList.add('reveal-on');
      var rio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var d = parseInt(e.target.getAttribute('data-aos-delay'), 10) || 0;
            e.target.style.transitionDelay = d + 'ms';
            e.target.classList.add('is-in');
            rio.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { rio.observe(el); });
    }
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
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animate(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  // ---- Accordion FAQ (single-open, acessível) ----
  document.querySelectorAll('.faq__q').forEach(function (btn) {
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
    var watch = ['#oferta', '#final'].map(function (s) { return document.querySelector(s); }).filter(Boolean);
    var nearCTA = function () {
      return watch.some(function (el) {
        var r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
      });
    };
    var apply = function () {
      var past = window.scrollY > (hero ? hero.offsetHeight * 0.9 : 600);
      var show = past && !nearCTA();
      sticky.classList.toggle('show', show);
      if (show) { sticky.removeAttribute('inert'); }
      else { sticky.setAttribute('inert', ''); }
    };
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () { apply(); ticking = false; });
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
