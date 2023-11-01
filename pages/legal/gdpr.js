import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Legal from 'components/Legal';
import DocDescription from 'components/DocDescription';
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
      <Head noIndex>
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
        <DocDescription>{body}</DocDescription>
      </Legal>
    </Layout>
  );
}
