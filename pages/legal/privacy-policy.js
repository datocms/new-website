import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Legal from 'components/Legal';
import tiny from 'tiny-json-http';

export async function getStaticProps() {
  const { body: { content: body } } = await tiny.get({
    url: 'https://www.iubenda.com/api/privacy-policy/64648824/only-legal',
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
      <Hero
        over="Legal"
        title={
          <>
            <Highlight>Privacy Policy</Highlight>
          </>
        }
      />
      <Legal>
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </Legal>
    </Layout>
  );
}
