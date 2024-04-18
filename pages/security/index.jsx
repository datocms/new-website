import DocDescription from 'components/DocDescription';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import Legal from 'components/Legal';

import fs from 'node:fs';
import util from 'node:util';

const readFile = util.promisify(fs.readFile);

export async function getStaticProps() {
  const body = await readFile('pages/legal/docs/security.md', 'utf8');

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
        <title>DatoCMS Security</title>
      </Head>
      <Hero
        kicker="Legal"
        title={
          <>
            <Highlight>DatoCMS Security</Highlight>
          </>
        }
        subtitle="We care about protecting your work, from the ground up"
      />
      <Legal>
        <DocDescription>{body}</DocDescription>
      </Legal>
    </Layout>
  );
}
