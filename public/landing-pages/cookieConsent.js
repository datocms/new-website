// Usage:
// <script type="text/javascript" src="https://www.datocms.com/landing-pages/cookieConsent.js"></script>

(() => {
  const html = `
  <div class="consent--cookies">
    <div class="consent--cookiesText">We use cookies to enhance the user experience. Do you consent their use in accordance with <a href="https://www.datocms.com/legal/cookie-policy">our cookie policy</a>?</div>
    <button class="consent--cookiesButton consent--cookiesPrimaryButton" data-consent="true">I consent</button>
    <button class="consent--cookiesButton" data-decline="true">I decline</button>
  </div>
`;

  const css = `
 .consent--cookies {
  position:fixed;
  bottom:0;
  left:0;
  right:0;
  background:#444;
  padding:10px;
  font-size:15px;
  color:#fff;
  text-align:center;
  font-family: Colfax;
  z-index:10000;
 }
 .consent--cookiesText {
  margin-right:20px;
  display:inline-block
 }
 @media screen and (max-width:1069px) {
  .consent--cookiesText {
   display:block;
   margin-right:0;
   margin-bottom:10px
  }
 }
 .consent--cookies a {
  color:#fff
 }
 .consent--cookiesButton {
  background:#2e343f;
  color:#fff!important;
  display:inline-block;
  padding:10px;
  font-weight:500;
  border-radius:3px;
  border:0;
  font-size:inherit;
  transition:opacity .15s ease-in-out;
  cursor:pointer;
  text-decoration:none;
  margin-right:4px
 }
 .consent--cookiesButton:hover {
  opacity:.8
 }
 .consent--cookiesPrimaryButton {
  background:#71788a;
 }
`;

  const gtmScript = `
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-TJRM9NT');
`;

  const cookieName = 'cookies-accepted';

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp(`${name}=([^;]+)`));
    if (match) return match[1];
  };

  const setCookie = (name, value, days) => {
    let expires = '';

    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toGMTString()}`;
    }

    document.cookie = `${name}=${value}${expires}; path=/; domain=.datocms.com; samesite=none; secure`;
  };

  function onReady(cb) {
    if (document.readyState === 'complete') {
      cb();
    } else {
      window.addEventListener('load', cb);
    }
  }

  onReady(() => {
    if (getCookie(cookieName)) {
      return;
    }

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);

    document
      .querySelector('.consent--cookies [data-consent]')
      .addEventListener('click', () => {
        container.parentNode.removeChild(container);
        setCookie(cookieName, 'true');

        const script = document.createElement('script');
        script.appendChild(document.createTextNode(gtmScript));
        document.getElementsByTagName('head')[0].appendChild(script);
      });

    document
      .querySelector('.consent--cookies [data-decline]')
      .addEventListener('click', () => {
        container.parentNode.removeChild(container);
      });
  });
})();
