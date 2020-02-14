import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Legal from 'components/Legal';
import fetch from 'isomorphic-unfetch';

export async function unstable_getStaticProps() {
  const res = await fetch(
    'https://www.iubenda.com/api/privacy-policy/64648824/cookie-policy',
    {
      headers: { Accept: 'application/json' },
    },
  );
  const page = await res.json();

  return {
    props: {
      body: page.content,
    },
  };
}

export default function Gdpr({ body }) {
  return (
    <Layout>
      <Hero
        over="Legal"
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
