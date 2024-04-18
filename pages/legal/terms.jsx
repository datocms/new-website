import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Legal from 'components/Legal';
import DocDescription from 'components/DocDescription';
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
      <Head noIndex>
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
        <DocDescription>{body}</DocDescription>
      </Legal>
    </Layout>
  );
}
