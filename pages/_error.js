import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Head from 'next/head';

function Error({ statusCode }) {
  let title;

  if (statusCode === 404) {
    title = (
      <>
        Sorry, the page you requested <Highlight>was not found</Highlight>!
      </>
    );
  } else if (statusCode) {
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
  return { statusCode };
};

export default Error;
