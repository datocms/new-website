import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Head from 'next/head';
import Highlight from 'components/Highlight';
import Wrapper from 'components/Wrapper';

function Error() {
  return (
    <Layout noCta>
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
        We&apos;ve already been alerted about this and we&apos;ll try to fix
        this as soon as possible!
      </Wrapper>
    </Layout>
  );
}

export default Error;
