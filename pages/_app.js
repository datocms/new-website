import * as Fathom from 'fathom-client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../components/BaseLayout/global.css';
import '../components/NProgress/style.css';
import { getCookie, setCookie } from 'utils/cookies';

function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('utm_source');

    // Initialize Fathom when the app loads
    Fathom.load('NVXWCARK', {
      includedDomains: ['www.datocms.com'],
      url: 'https://panther.datocms.com/script.js',
      honorDNT: true,
    });

    if (source && !getCookie('datoUtm')) {
      const medium = urlParams.get('utm_medium');
      const campaign = urlParams.get('utm_campaign');

      setCookie('datoUtm', JSON.stringify({ source, medium, campaign }), 365);

      if (source === 'twitter') {
        Fathom.trackGoal('5OHZ6BAS', 0);
      }
    }

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, []);

  return <Component {...pageProps} />;
}

export default App;
