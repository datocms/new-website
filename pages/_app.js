import * as Fathom from 'fathom-client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../components/BaseLayout/global.css';
import '../components/NProgress/style.css';

function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Initialize Fathom when the app loads
    Fathom.load('NVXWCARK', {
      includedDomains: ['datocms.com'],
      url: 'https://panther.datocms.com/script.js',
      honorDNT: true,
    });

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
