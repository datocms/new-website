import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Legal from 'components/Legal';
import Head from 'components/Head';

import fs from 'fs';
import util from 'util';

const readFile = util.promisify(fs.readFile);

export async function getStaticProps() {
  const body = JSON.parse(
    await readFile('pages/legal/docs/privacy.json', 'utf8'),
  ).content;

  return {
    props: {
      body,
    },
  };
}

export default function PrivacyPolicy({ body }) {
  return (
    <Layout>
      <Head noIndex>
        <title>Privacy Policy</title>
      </Head>
      <Hero
        kicker="Legal"
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
