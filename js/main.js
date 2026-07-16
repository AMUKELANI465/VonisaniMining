/* ============================================================
   VONISANANI MINING & CIVILS — SITE SCRIPT
   Vanilla JS only. Handles: header state, mobile nav, scroll
   reveals, count-up stats, hero slideshow, fracture dividers,
   scroll progress, back-to-top, contact form.
   ============================================================ */
(function(){
  "use strict";

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header shrink on scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScrollHeader(){
    if(!header) return;
    if(window.scrollY > 40){ header.classList.add('scrolled'); }
    else{ header.classList.remove('scrolled'); }
  }
  document.addEventListener('scroll', onScrollHeader, { passive:true });
  onScrollHeader();

  /* ---------- Scroll progress bar ---------- */
  var progress = document.querySelector('.scroll-progress');
  function onScrollProgress(){
    if(!progress) return;
    var h = document.documentElement;
    var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = (scrolled || 0) + '%';
  }
  document.addEventListener('scroll', onScrollProgress, { passive:true });
  onScrollProgress();

  /* ---------- Back to top ---------- */
  var toTop = document.querySelector('.to-top');
  if(toTop){
    document.addEventListener('scroll', function(){
      if(window.scrollY > 700){ toTop.classList.add('show'); }
      else{ toTop.classList.remove('show'); }
    }, { passive:true });
    toTop.addEventListener('click', function(){
      window.scrollTo({ top:0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector('.burger');
  var mobileNav = document.querySelector('.mobile-nav');
  if(burger && mobileNav){
    burger.addEventListener('click', function(){
      var open = mobileNav.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        mobileNav.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll reveal via IntersectionObserver ---------- */
  var revealEls = document.querySelectorAll('.reveal, .fracture');
  if('IntersectionObserver' in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:.16, rootMargin:'0px 0px -60px 0px' });
    revealEls.forEach(function(el, i){
      el.style.setProperty('--i', i % 8);
      io.observe(el);
    });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if(counters.length){
    var counted = new WeakSet();
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting && !counted.has(entry.target)){
          counted.add(entry.target);
          animateCount(entry.target);
        }
      });
    }, { threshold:.5 });
    counters.forEach(function(el){ cio.observe(el); });
  }
  function animateCount(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = reduceMotion ? 1 : 1400;
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = target * eased;
      el.textContent = (Number.isInteger(target) ? Math.floor(val) : val.toFixed(1)) + suffix;
      if(progress < 1){ requestAnimationFrame(step); }
      else{ el.textContent = target + suffix; }
    }
    requestAnimationFrame(step);
  }

  /* ---------- Hero slideshow (Ken Burns crossfade) ---------- */
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-dots button');
  if(slides.length > 1){
    var current = 0;
    function showSlide(i){
      slides.forEach(function(s, idx){ s.classList.toggle('active', idx === i); });
      dots.forEach(function(d, idx){ d.classList.toggle('active', idx === i); });
      current = i;
    }
    dots.forEach(function(d, idx){
      d.addEventListener('click', function(){ showSlide(idx); resetInterval(); });
    });
    var interval = setInterval(function(){ showSlide((current + 1) % slides.length); }, 5200);
    function resetInterval(){ clearInterval(interval); interval = setInterval(function(){ showSlide((current + 1) % slides.length); }, 5200); }
  }

  /* ---------- Contact form (client-side, mailto fallback) ---------- */
  var form = document.querySelector('.contact-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var name = form.querySelector('#cf-name');
      var email = form.querySelector('#cf-email');
      var message = form.querySelector('#cf-message');

      var valid = true;
      [name, email, message].forEach(function(f){
        if(f && !f.value.trim()){ valid = false; f.style.borderColor = '#c0392b'; }
        else if(f){ f.style.borderColor = ''; }
      });

      if(!valid){
        if(status){
          status.textContent = 'Please fill in all required fields.';
          status.style.color = '#c0392b';
          status.classList.add('show');
        }
        return;
      }

      var subject = encodeURIComponent('Website enquiry from ' + name.value);
      var body = encodeURIComponent(
        'Name: ' + name.value + '\n' +
        'Email: ' + email.value + '\n\n' +
        message.value
      );

      if(status){
        status.textContent = 'Opening your email client to send this enquiry…';
        status.style.color = '#1b6b3a';
        status.classList.add('show');
      }

      window.location.href = 'mailto:info@vonisanani.co.za?subject=' + subject + '&body=' + body;
    });
  }

  /* ---------- Set active nav link ---------- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-desktop a, .mobile-nav a').forEach(function(a){
    var href = a.getAttribute('href');
    if(href === path || (path === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });

})();
