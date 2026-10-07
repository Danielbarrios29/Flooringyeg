// Cookie consent: show banner, store choice, and load GA4 only when accepted
(function(){
  const GA_META_NAME = 'ga4-id';
  const CONSENT_COOKIE = 'cookie_consent';
  const COOKIE_DAYS = 365;

  function setCookie(name, value, days){
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/';
  }

  function getCookie(name){
    const parts = document.cookie.split(';').map(s=>s.trim());
    for(const p of parts){
      if(p.indexOf(name+'=')===0) return p.substring(name.length+1);
    }
    return null;
  }

  function createBanner(){
    const wrapper = document.createElement('div');
    wrapper.id = 'cookiePopup';
    wrapper.className = 'cookie-popup show';
    wrapper.innerHTML = `
      <div class="cookie-inner">
        <p>We use cookies to improve your experience. You can accept or reject analytics cookies.</p>
        <div class="cookie-actions">
          <button id="acceptCookie" class="btn-accept">Accept</button>
          <button id="rejectCookie" class="btn-reject">Reject</button>
          <a href="/Flooringyeg/privacy.html" class="cookie-link">Privacy policy</a>
        </div>
      </div>`;
    document.body.appendChild(wrapper);
    document.getElementById('acceptCookie').addEventListener('click', onAccept);
    document.getElementById('rejectCookie').addEventListener('click', onReject);
  }

  function onAccept(){
    setCookie(CONSENT_COOKIE,'accepted',COOKIE_DAYS);
    hideBanner();
    loadGA();
  }

  function onReject(){
    setCookie(CONSENT_COOKIE,'rejected',COOKIE_DAYS);
    hideBanner();
  }

  function hideBanner(){
    const el = document.getElementById('cookiePopup');
    if(el) el.parentNode.removeChild(el);
  }

  function loadGA(){
    const meta = document.querySelector('meta[name="'+GA_META_NAME+'"]');
    const id = meta ? meta.getAttribute('content') : null;
    if(!id) return;
    if(window.gtagLoaded) return;
    window.gtagLoaded = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(s);

    const inline = document.createElement('script');
    inline.innerHTML = "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '"+id+"', { 'anonymize_ip': true });";
    document.head.appendChild(inline);
  }

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', function(){
    const choice = getCookie(CONSENT_COOKIE);
    if(choice === 'accepted'){
      loadGA();
      return;
    }
    if(choice === 'rejected'){
      // don't load GA
      return;
    }
    // No choice yet -> show banner
    createBanner();
  });
})();
