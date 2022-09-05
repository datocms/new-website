import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Legal from 'components/Legal';
import tiny from 'tiny-json-http';
import Head from 'components/Head';

export async function getStaticProps() {
  const {
    body: { content: body },
  } = await tiny.get({
    url: 'https://www.iubenda.com/api/privacy-policy/64648824/cookie-policy',
  });

  return {
    props: {
      body,
    },
  };
}

export default function Gdpr({ body }) {
  return (
    <Layout>
      <Head noIndex>
        <title>Cookie Policy</title>
      </Head>
      <Hero
        kicker="Legal"
        title={
          <>
            <Highlight>Cookie Policy</Highlight>
          </>
        }
      />
      <Legal>
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </Legal>
    </Layout>
  );
}
