import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Legal from 'components/Legal';
import ReactMarkdown from 'react-markdown';
import fs from 'fs';
import util from 'util';
import Head from 'components/Head';

export async function getStaticProps() {
  const readFile = util.promisify(fs.readFile);
  const body = await readFile('pages/legal/docs/terms.md', 'utf8');

  return {
    props: {
      body,
    },
  };
}

export default function Terms({ body }) {
  return (
    <Layout>
      <Head>
        <title>Terms of Service</title>
      </Head>
      <Hero
        kicker="Legal"
        title={
          <>
            <Highlight>Terms of Service</Highlight>
          </>
        }
      />
      <Legal>
        <ReactMarkdown>{body}</ReactMarkdown>
      </Legal>
    </Layout>
  );
}
