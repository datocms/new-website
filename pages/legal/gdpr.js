import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Legal from 'components/Legal';
import ReactMarkdown from 'react-markdown';
import Head from 'components/Head';

import fs from 'fs';
import util from 'util';

const readFile = util.promisify(fs.readFile);

export async function getStaticProps() {
  const body = await readFile('pages/legal/docs/gdpr.md', 'utf8');

  return {
    props: {
      body,
    },
  };
}

export default function Gdpr({ body }) {
  return (
    <Layout>
      <Head>
        <title>GDPR Compliance</title>
      </Head>
      <Hero
        kicker="Legal"
        title={
          <>
            <Highlight>GDPR Compliance</Highlight>
          </>
        }
      />
      <Legal>
        <ReactMarkdown>{body}</ReactMarkdown>
      </Legal>
    </Layout>
  );
}
