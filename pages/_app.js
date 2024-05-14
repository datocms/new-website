import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import '../components/BaseLayout/global.css';
import '../components/NProgress/style.css';
import { getCookie, setCookie } from 'utils/cookies';
import { ToastProvider } from 'react-toast-notifications';
import { Provider, ErrorBoundary } from '@rollbar/react';
import Hero from 'components/Hero';
import Wrapper from 'components/Wrapper';
import Head from 'components/Head';
import Highlight from 'components/Highlight';
import Script from 'next/script';

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

function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('utm_source');

    if (source && !getCookie('datoUtm')) {
      const medium = urlParams.get('utm_medium');
      const campaign = urlParams.get('utm_campaign');

      setCookie('datoUtm', JSON.stringify({ source, medium, campaign }), 365);
    }
  }, [router.events]);

  return (
    <ToastProvider placement="bottom-right">
      <Provider config={rollbarConfig}>
        <ErrorBoundary fallbackUI={ErrorDisplay}>
          <Script
            id="cookie-consent"
            strategy="afterInteractive"
            src="/landing-pages/cookieConsent.js"
          />
          <Component {...pageProps} />
        </ErrorBoundary>
      </Provider>
    </ToastProvider>
  );
}

export default App;
