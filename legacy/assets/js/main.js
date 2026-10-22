/* FSP Catalyst Connect 3.0 — interactions
   Mirrors wisprflow.ai's behaviour set: rotating announce bar, sticky nav,
   infinite logo marquee, auto-advancing tabs, segmented control, accordion,
   scroll reveals, count-ups, click-to-play video, floating promo. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ------------------------------------------------ announcement ticker */
  (function announceTicker() {
    var items = $$('.announce-item');
    if (items.length < 2 || reduced) return;
    var i = 0;
    setInterval(function () {
      items[i].classList.remove('is-active');
      i = (i + 1) % items.length;
      items[i].classList.add('is-active');
    }, 4200);
  })();

  /* ------------------------------------------------------------ sticky nav */
  (function stickyNav() {
    var nav = $('#nav');
    if (!nav) return;
    var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 12); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ----------------------------------------------------------- mobile nav */
  (function mobileNav() {
    var toggle = $('#navToggle'), panel = $('#navMobile');
    if (!toggle || !panel) return;
    var close = function () {
      toggle.classList.remove('is-open');
      panel.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', function () {
      var open = !panel.classList.contains('is-open');
      toggle.classList.toggle('is-open', open);
      panel.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('a', panel).forEach(function (a) { a.addEventListener('click', close); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  })();

  /* ------------------------------------------------------ client marquee */
  (function marquee() {
    $$('[data-clients]').forEach(function (track) {
      var range = track.getAttribute('data-clients').split('-');
      var from = parseInt(range[0], 10), to = parseInt(range[1], 10);
      var html = '';
      for (var pass = 0; pass < 2; pass++) {          // duplicated for a seamless -50% loop
        for (var i = from; i <= to; i++) {
          html += '<img src="assets/images/clients/' + i + '.png" alt="Client of Key Purpose Training Solutions" loading="lazy" />';
        }
      }
      track.innerHTML = html;
    });
  })();

  /* --------------------------------------------------------- scroll reveal */
  (function reveal() {
    var targets = $$('[data-reveal]');
    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-revealed'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  })();

  /* -------------------------------------------------------------- count-up */
  (function countUp() {
    var nodes = $$('[data-count]');
    if (!nodes.length) return;

    var fmt = function (n, mode) {
      if (mode === 'in') {                             // Indian grouping: 1,00,000
        var s = String(n), last3 = s.slice(-3), rest = s.slice(0, -3);
        return rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3 : last3;
      }
      return String(n);
    };

    var run = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var mode   = el.getAttribute('data-format') || '';
      if (reduced) { el.textContent = fmt(target, mode) + suffix; return; }
      var start = performance.now(), dur = 1500;
      var step = function (now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * eased), mode) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) { nodes.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    nodes.forEach(function (el) { io.observe(el); });
  })();

  /* --------------------------------------------- curriculum tabs (auto) */
  (function tabs() {
    var items  = $$('.tab-item');
    var panels = $$('.stage-panel');
    if (!items.length) return;

    var idx = 0, timer = null, AUTO = 7000;

    var activate = function (n) {
      idx = n;
      items.forEach(function (it, i) {
        var on = i === n;
        it.classList.toggle('is-active', on);
        it.setAttribute('aria-selected', String(on));
        var bar = $('.tab-progress', it);
        if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
      });
      panels.forEach(function (p, i) { p.classList.toggle('is-active', i === n); });
    };

    var play = function () {
      if (reduced) return;
      clearInterval(timer);
      timer = setInterval(function () { activate((idx + 1) % items.length); }, AUTO);
    };

    items.forEach(function (it, i) {
      it.addEventListener('click', function () { activate(i); play(); });
      it.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); activate((i + 1) % items.length); items[(i + 1) % items.length].focus(); play(); }
        if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); var p = (i - 1 + items.length) % items.length; activate(p); items[p].focus(); play(); }
      });
    });

    var stage = $('.tabs-layout');
    if (stage) {
      stage.addEventListener('mouseenter', function () { clearInterval(timer); });
      stage.addEventListener('mouseleave', play);
    }

    // only auto-advance while the section is on screen
    if ('IntersectionObserver' in window && stage) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) play();
          else clearInterval(timer);
        });
      }, { threshold: 0.25 }).observe(stage);
    } else { play(); }
  })();

  /* ------------------------------------------------- audience segmented */
  (function segments() {
    var buttons = $$('.segment button');
    var avatar = $('#segAvatar'), role = $('#segRole'), quote = $('#segQuote');
    if (!buttons.length || !role) return;

    var data = [
      ['🎤', "You're a freelance trainer who wants to grow and earn more.",
             "You already deliver well. What's missing is a pipeline — a position companies recognise and a repeatable way to reach them."],
      ['📊', "You're an L&D professional who wants to become an independent facilitator.",
             "You know how training is bought from the inside. Learn how to sit on the other side of that table and price your own programs."],
      ['🧭', "You're a coach who wants corporate clients.",
             "One-to-one work has a ceiling. Corporate mandates pay for the room, not the hour — this is how you package your coaching for an organization."],
      ['🤝', "You're an HR professional interested in becoming a freelance trainer.",
             "You've shortlisted trainers for years. Now build the profile, proposal and positioning that would make you the shortlist."],
      ['💡', "You're an experienced professional who wants to share your knowledge with organizations.",
             "Your domain experience is already the product. We'll turn it into a training topic companies budget for."],
      ['🎓', "You're a teacher or professor who wants to transition into corporate training.",
             "Classroom skill transfers — the buying process doesn't. Learn how corporates choose trainers and how to speak their language."]
    ];

    buttons.forEach(function (b, i) {
      b.addEventListener('click', function () {
        buttons.forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        var d = data[i] || data[0];
        if (avatar) avatar.textContent = d[0];
        role.textContent = d[1];
        quote.textContent = d[2];
        [avatar, role, quote].forEach(function (el) {
          if (!el) return;
          el.classList.remove('segment-fade'); void el.offsetWidth; el.classList.add('segment-fade');
        });
      });
    });
  })();

  /* ---------------------------------------------------------- FAQ accordion */
  (function faq() {
    var items = $$('.faq-item');
    var setHeight = function (item) {
      var a = $('.faq-a', item);
      if (!a) return;
      a.style.maxHeight = item.classList.contains('is-open') ? a.scrollHeight + 'px' : '0px';
    };
    items.forEach(function (item) {
      var q = $('.faq-q', item);
      setHeight(item);
      if (!q) return;
      q.addEventListener('click', function () {
        var willOpen = !item.classList.contains('is-open');
        items.forEach(function (o) { o.classList.remove('is-open'); setHeight(o); });
        item.classList.toggle('is-open', willOpen);
        setHeight(item);
      });
    });
    window.addEventListener('resize', function () { items.forEach(setHeight); });
  })();

  /* -------------------------------------------------- click-to-play video */
  (function videos() {
    $$('.video-frame[data-video]').forEach(function (frame) {
      var poster = $('.video-poster', frame);
      if (!poster) return;
      poster.addEventListener('click', function () {
        var id = frame.getAttribute('data-video');
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1';
        iframe.title = 'FSP Catalyst Connect 3.0 video';
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        frame.appendChild(iframe);
        poster.style.opacity = '0';
        setTimeout(function () { poster.remove(); }, 400);
      });
    });
  })();

  /* ------------------------------------------------------- floating promo */
  (function promo() {
    var el = $('#promo'), close = $('#promoClose');
    if (!el) return;
    var shown = false;
    window.addEventListener('scroll', function () {
      if (shown || el.classList.contains('is-closed')) return;
      if (window.scrollY > window.innerHeight * 0.9) { el.classList.add('is-shown'); shown = true; }
    }, { passive: true });
    if (close) close.addEventListener('click', function () { el.classList.add('is-closed'); });

    // hide while the registration form is in view
    var reg = $('#register');
    if (reg && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { el.style.opacity = e.isIntersecting ? '0' : ''; el.style.pointerEvents = e.isIntersecting ? 'none' : ''; });
      }, { threshold: 0.2 }).observe(reg);
    }
  })();

  /* ---------------------------------------------------------------- form */
  (function form() {
    var f = $('#registerForm'), ok = $('#formSuccess');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var invalid = $$('input[required]', f).filter(function (i) { return !i.value.trim(); });
      if (invalid.length) { invalid[0].focus(); return; }
      if (ok) ok.classList.add('is-shown');
      f.reset();
    });
  })();

})();
