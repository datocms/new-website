import { NextResponse } from 'next/server';
import { geolocation } from '@vercel/edge';

export const config = {
  runtime: 'experimental-edge',
};

// Usage:
// <script type="text/javascript" src="https://www.datocms.com/landing-pages/cookieConsent.js"></script>

const gdprCountries = [
  'AT',
  'BE',
  'BG',
  'CY',
  'CH',
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FR',
  'GB',
  'GR',
  'HR',
  'HU',
  'IE',
  'IS',
  'IT',
  'LI',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'NO',
  'PL',
  'PT',
  'RO',
  'SE',
  'SI',
  'SK',
];

const gtmScript = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TJRM9NT');
`;

const cookieConsentScript = `
(() => {
  const gtmScript = \`${gtmScript}\`;

  function addGtmScript() {
    const script = document.createElement('script');
    script.appendChild(document.createTextNode(gtmScript));
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  function onReady(cb) {
    if (document.readyState === 'complete') {
      cb();
    } else {
      window.addEventListener('load', cb);
    }
  }

  const html = \`
  <div class="consent--cookiesWrapper">
    <div class="consent--cookies">
      <div class="consent--cookiesTitle">Do you allow us to use cookies?</div>
      <div class="consent--cookiesText">We use cookies to learn where you struggle when you're navigating our website, and fix them for your feature visits. Your privacy is important for us, and we will never sell your data — read our <a href="https://www.datocms.com/legal/cookie-policy">Cookie Policy</a> for more info.</div>
      <button class="consent--cookiesButton consent--cookiesPrimaryButton" data-consent="true">Accept recommended cookies</button>
      <button class="consent--cookiesButton" data-decline="true">Reject</button>
    </div>
  </div>
  \`;

  const css = \`
  .consent--cookiesWrapper {
    position: fixed;
    z-index: 1000000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    animation-duration: 0.2s;
    animation-name: cookies-appear;
    animation-timing-function: ease-in;
    font-family: Colfax;
  }

  @keyframes cookies-appear {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .consent--cookies {
    background: white;
    border-radius: 10px;
    padding: 30px;
    max-width: 550px;
    font-size: 14px;
    text-align: center;
    box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.3);
    margin: 10px;
  }

  .consent--cookiesTitle {
    font-weight: bold;
    font-size: 22px;
    letter-spacing: -0.02em;
    margin-bottom: 10px;
  }

  .consent--cookiesText {
    margin-right: 20px;
    display: block;
    margin-bottom: 20px;
  }

  .consent--cookies a {
    color: inherit;
  }

  .consent--cookiesButton {
    background: transparent;
    display: inline-block;
    padding: 0.5em 1em;
    font-family: var(--font-sans);
    color: #71788a;
    border-radius: 3px;
    font-size: 18px;
    border: 0;
    transition: opacity 150ms ease-in-out;
    cursor: pointer;
    text-decoration: none;
    margin-right: 4px;

    &:hover {
      opacity: 0.8;
    }
  }

  .consent--cookiesPrimaryButton {
    background: linear-gradient(to right, #ff593d, #ff7751);
    color: white !important;
    font-weight: bold;
  }
  \`;

  const cookieName = 'cookies-accepted';

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp(name + '=([^;]+)'));
    if (match) return match[1];
  };

  const setCookie = (name, value, days) => {
    let expires = '';

    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toGMTString();
    }

    document.cookie = name + '=' + value + expires + '; path=/; domain=.datocms.com; samesite=none; secure';
  };

  onReady(() => {
    if (getCookie(cookieName)) {
      addGtmScript();
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
        addGtmScript();
      });

    document
      .querySelector('.consent--cookies [data-decline]')
      .addEventListener('click', () => {
        container.parentNode.removeChild(container);
      });
  });
})();
`;

const handler = (request) => {
  const { country } = geolocation(request);

  const consentAccepted = Boolean(request.cookies.get('cookies-accepted'));
  const showCookieConsent = !consentAccepted && gdprCountries.includes(country);

  const response = new NextResponse(
    [
      `/* c:${country},a:${consentAccepted ? 'y' : 'n'} */`,
      showCookieConsent ? cookieConsentScript : gtmScript,
    ].join('\n'),
  );
  response.headers.set('Content-Type', 'application/javascript');

  return response;
};

export default handler;
