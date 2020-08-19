import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Head from 'next/head';

function Error({ statusCode }) {
  let title;

  if (statusCode) {
    title = (
      <>
        A <Highlight>{statusCode} error</Highlight>
        <br />
        occurred on server!
      </>
    );
  } else {
    title = <>An error occurred on client!</>;
  }

  return (
    <Layout noCta>
      <Head>
        <title>Error {statusCode}</title>
      </Head>
      <Hero kicker="Application error" title={title} />
    </Layout>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  if (!process.browser) {
    console.log('Reporting error to Rollbar...');
    const Rollbar = require('rollbar');
    const rollbar = new Rollbar({
      accessToken: process.env.ROLLBAR_TOKEN,
      captureUncaught: true,
      captureUnhandledRejections: true,
    });
    rollbar.error(err, res, (rollbarError) => {
      if (rollbarError) {
        console.error('Rollbar error reporting failed:');
        console.error(rollbarError);
        return;
      }
      console.log('Reported error to Rollbar');
    });
  }
  return { statusCode };
};

export default Error;
