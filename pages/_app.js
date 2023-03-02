import * as Fathom from 'fathom-client';
import Router from 'next/router';
import { useEffect } from 'react';
import '../components/BaseLayout/global.css';
import '../components/NProgress/style.css';
import { getCookie, setCookie } from 'utils/cookies';
import { ToastProvider } from 'react-toast-notifications';
import { Provider, ErrorBoundary } from '@rollbar/react';
import Hero from 'components/Hero';
import Wrapper from 'components/Wrapper';
import Head from 'components/Head';
import Highlight from 'components/Highlight';

const rollbarConfig = {
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
};

const ErrorDisplay = ({ error, resetError }) => (
  <div style={{ margin: '0 40px' }}>
    <Head>
      <title>Website error</title>
    </Head>

    <Hero
      kicker="Website error"
      title={
        <>
          <Highlight>Ouch!</Highlight> This should not have happened...
        </>
      }
    />
    <Wrapper>
      Sorry, but an error prevented the requested page from rendering.
      We&apos;ve already been alerted about this and we&apos;ll try to fix this
      as soon as possible!
    </Wrapper>
  </div>
);

Router.events.on('routeChangeComplete', (as, routeProps) => {
  if (!routeProps.shallow) {
    Fathom.trackPageview();
  }
});

function App({ Component, pageProps }) {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('utm_source');

    Fathom.load('NVXWCARK', {
      includedDomains: ['www.datocms.com'],
      url: '/api/fathom/load.js',
      honorDNT: true,
      spa: 'auto',
    });

    if (source && !getCookie('datoUtm')) {
      const medium = urlParams.get('utm_medium');
      const campaign = urlParams.get('utm_campaign');

      setCookie('datoUtm', JSON.stringify({ source, medium, campaign }), 365);
    }
  }, []);

  return (
    <ToastProvider placement="bottom-right">
      <Provider config={rollbarConfig}>
        <ErrorBoundary fallbackUI={ErrorDisplay}>
          <Component {...pageProps} />
        </ErrorBoundary>
      </Provider>
    </ToastProvider>
  );
}

export default App;
