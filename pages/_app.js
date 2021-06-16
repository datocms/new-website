import * as Fathom from 'fathom-client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../components/BaseLayout/global.css';
import '../components/NProgress/style.css';
import { getCookie, setCookie } from 'utils/cookies';
import { ToastProvider } from 'react-toast-notifications';

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

    function onRouteChangeStart() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }

    // Scroll to top
    router.events.on('routeChangeStart', onRouteChangeStart);

    // Record a pageview when route changes
    router.events.on('routeChangeComplete', onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete);
      router.events.off('routeChangeStart', onRouteChangeStart);
    };
  }, [router.events]);

  return (
    <ToastProvider placement="bottom-right">
      <Component {...pageProps} />
    </ToastProvider>
  );
}

export default App;
