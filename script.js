// Click a screenshot to view it enlarged
(function () {
  var box = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  if (!box || !img) return;
  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    box.style.display = 'flex';
  }
  function close() {
    box.style.display = 'none';
    img.removeAttribute('src');
  }
  document.querySelectorAll('.shot-img').forEach(function (el) {
    el.addEventListener('click', function () { open(el.src, el.alt); });
  });
  box.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();

// Mobile menu toggle
(function () {
  var btn = document.querySelector('.hamburger');
  var menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', function () {
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { menu.classList.remove('open'); });
  });
})();

// Two portfolio paths: engineering (default) and project management.
// ?role=eng / ?role=pm sets the initial view; the nav toggle switches live.
(function () {
  var KEY = 'pb-path';
  var TITLES = {
    eng: 'Patrick Boudreaux — Software Engineer',
    pm: 'Patrick Boudreaux — Project Manager, PMP'
  };

  function initialPath() {
    var q = new URLSearchParams(window.location.search).get('role');
    if (q === 'eng' || q === 'pm') return q;
    try {
      var saved = localStorage.getItem(KEY);
      if (saved === 'eng' || saved === 'pm') return saved;
    } catch (e) {}
    return 'eng';
  }

  function swapContent(path) {
    document.querySelectorAll('[data-pm]').forEach(function (el) {
      if (el._engHTML === undefined) el._engHTML = el.innerHTML;
      el.innerHTML = path === 'pm' ? el.getAttribute('data-pm') : el._engHTML;
    });
    document.querySelectorAll('[data-pm-href]').forEach(function (el) {
      if (el._engHref === undefined) el._engHref = el.getAttribute('href');
      el.setAttribute('href', path === 'pm' ? el.getAttribute('data-pm-href') : el._engHref);
    });
  }

  // Absolute section order per path, asserted on every apply.
  var ORDER = {
    eng: ['top', 'about', 'certs', 'experience', 'projects', 'classcape', 'contact'],
    pm: ['top', 'about', 'certs', 'classcape', 'experience', 'projects', 'contact']
  };

  function orderSections(path) {
    var ids = ORDER[path] || ORDER.eng;
    var footer = document.querySelector('footer');
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (footer) document.body.insertBefore(el, footer);
      else document.body.appendChild(el);
    });

    document.querySelectorAll('.nav-links, .mobile-menu').forEach(function (list) {
      ids.forEach(function (id) {
        var link = list.querySelector('[href="#' + id + '"]');
        if (!link) return;
        var item = list.classList.contains('nav-links') ? link.parentNode : link;
        list.appendChild(item);
      });
      var toggle = list.querySelector('.path-toggle');
      if (toggle) list.appendChild(toggle);
    });
  }

  function apply(path, persist) {
    document.body.classList.toggle('path-pm', path === 'pm');
    document.body.classList.toggle('path-eng', path !== 'pm');
    swapContent(path);
    orderSections(path);
    document.title = TITLES[path];
    document.querySelectorAll('.path-toggle button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-path') === path));
    });
    if (persist) {
      try { localStorage.setItem(KEY, path); } catch (e) {}
    }
  }

  document.querySelectorAll('.path-toggle button').forEach(function (b) {
    b.addEventListener('click', function () {
      apply(b.getAttribute('data-path'), true);
    });
  });

  apply(initialPath(), false);
})();
