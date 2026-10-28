(function () {
  const CONSENT_COOKIE = 'cookie_consent';
  const COOKIE_DAYS = 365;
  const GA_META_NAME = 'ga4-id';

  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  function getCookie(name) {
    const all = document.cookie ? document.cookie.split(';') : [];
    for (let i = 0; i < all.length; i++) {
      const c = all[i].trim();
      if (c.indexOf(name + '=') === 0) return c.substring(name.length + 1);
    }
    return '';
  }

  function loadGAWhenIdle() {
    const id = document.querySelector('meta[name="' + GA_META_NAME + '"]')?.getAttribute('content');
    if (!id || window.gtagLoaded) return;
    const load = function () {
      if (window.gtagLoaded) return;
      window.gtagLoaded = true;
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', id, { anonymize_ip: true });
    };
    if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 5000 });
    else setTimeout(load, 2000);
  }

  function hideBanner() {
    const el = document.getElementById('cookiePopup');
    if (el) el.remove();
  }

  function showBanner() {
    const wrapper = document.createElement('div');
    wrapper.id = 'cookiePopup';
    wrapper.className = 'cookie-popup show';
    wrapper.innerHTML = '<div class="cookie-inner"><p>We use cookies to improve your experience. You can accept or reject analytics cookies.</p><div class="cookie-actions"><button id="acceptCookie" class="btn-accept">Accept</button><button id="rejectCookie" class="btn-reject">Reject</button><a href="/privacy.txt" class="cookie-link">Privacy policy</a></div></div>';
    document.body.appendChild(wrapper);

    document.getElementById('acceptCookie')?.addEventListener('click', function () {
      setCookie(CONSENT_COOKIE, 'accepted', COOKIE_DAYS);
      hideBanner();
      loadGAWhenIdle();
    }, { once: true });

    document.getElementById('rejectCookie')?.addEventListener('click', function () {
      setCookie(CONSENT_COOKIE, 'rejected', COOKIE_DAYS);
      hideBanner();
    }, { once: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const choice = getCookie(CONSENT_COOKIE);
    if (choice === 'accepted') {
      loadGAWhenIdle();
      return;
    }
    if (choice !== 'rejected') showBanner();
  });
})();
