(function () {
  var script = document.currentScript || document.querySelector('script[data-haven]');
  var base = (script && script.getAttribute('data-base')) || 'https://haven-widget.vercel.app';
  var accentColor = (script && script.getAttribute('data-color')) || '#4a7c59';

  // ── Styles ────────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent =
    '#haven-launcher{position:fixed;bottom:28px;right:28px;width:58px;height:58px;border-radius:50%;' +
    'background:linear-gradient(135deg,' + accentColor + ',' + accentColor + 'cc);' +
    'box-shadow:0 4px 20px ' + accentColor + '55;display:flex;align-items:center;justify-content:center;' +
    'cursor:pointer;z-index:99998;border:none;transition:transform .2s,box-shadow .2s}' +
    '#haven-launcher:hover{transform:scale(1.08)}' +
    '#haven-launcher svg{width:26px;height:26px;fill:white}' +
    '#haven-panel{position:fixed;bottom:100px;right:28px;width:390px;height:580px;border-radius:20px;' +
    'overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3),0 0 0 1px rgba(74,124,89,.15);' +
    'z-index:99999;display:none;opacity:0;transform:translateY(16px);transition:transform .25s,opacity .25s}' +
    '#haven-panel.open{display:block}' +
    '#haven-panel.visible{opacity:1;transform:translateY(0)}' +
    '#haven-panel iframe{width:100%;height:100%;border:none}' +
    '@media(max-width:480px){#haven-panel{bottom:0;right:0;width:100vw;height:100vh;border-radius:0}' +
    '#haven-launcher{bottom:20px;right:20px}}';
  document.head.appendChild(style);

  // ── Launcher button ───────────────────────────────────────────────────────
  var btn = document.createElement('button');
  btn.id = 'haven-launcher';
  btn.title = 'Chat with Haven';
  btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
  document.body.appendChild(btn);

  // ── Panel ─────────────────────────────────────────────────────────────────
  var panel = document.createElement('div');
  panel.id = 'haven-panel';

  var iframe = document.createElement('iframe');
  iframe.src = base + '/widget.html';
  iframe.allow = 'clipboard-write';
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');

  panel.appendChild(iframe);
  document.body.appendChild(panel);

  // ── Toggle ────────────────────────────────────────────────────────────────
  var isOpen = false;

  // Auto-open after 2 seconds
  setTimeout(function () { if (!isOpen) toggle(); }, 2000);

  btn.addEventListener('click', toggle);

  function toggle() {
    if (!isOpen) {
      panel.classList.add('open');
      setTimeout(function () { panel.classList.add('visible'); }, 10);
      isOpen = true;
    } else {
      panel.classList.remove('visible');
      setTimeout(function () { panel.classList.remove('open'); }, 250);
      isOpen = false;
    }
  }
})();
