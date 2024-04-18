import { geolocation } from '@vercel/edge';
import { NextResponse } from 'next/server';

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

const posthogScript = `
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t, e) { var o = e.split("."); 2 == o.length && (t = t[o[0]], e = o[1]), t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } }(p = t.createElement("script")).type = "text/javascript", p.async = !0, p.src = s.api_host + "/static/array.js", (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_u7FPCuTnUpVlYYTYmfeutKpnI7qEE2cjwgzjz3JDuH6',{api_host:'https://eu.posthog.com'})
`;

const cookieConsentScript = `
(() => {
  const posthogScript = \`${posthogScript}\`;

  function addPostHogScript() {
    const script = document.createElement('script');
    script.appendChild(document.createTextNode(posthogScript));
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
      <div class="consent--cookiesText">We use cookies to learn where you struggle when you're navigating our website, and fix them for your future visits. Your privacy is important for us, and we will never sell your data — read our <a href="https://www.datocms.com/legal/cookie-policy">Cookie Policy</a> for more info.</div>
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
    font-family: Colfax, colfax-web;
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

  const setCookie = (name, value) => {
    const expiration = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = name + '=' + value + '; expires=' + expiration + '; path=/; domain=.datocms.com; samesite=none; secure';
  };

  onReady(() => {
    if (getCookie(cookieName)) {
      addPosthogScript();
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
        addPosthogScript();
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
      showCookieConsent ? cookieConsentScript : posthogScript,
    ].join('\n'),
  );
  response.headers.set('Content-Type', 'application/javascript');

  return response;
};

export default handler;
