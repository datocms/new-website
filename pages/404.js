import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Head from 'components/Head';

function Error() {
  return (
    <Layout noCta>
      <Head>
        <title>404 Page not found!</title>
      </Head>
      <Hero
        kicker="Page not found"
        title={
          <>
            Sorry, the page you requested <Highlight>was not found</Highlight>!
          </>
        }
      />
    </Layout>
  );
}

export default Error;
