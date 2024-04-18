import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import Legal from 'components/Legal';

import fs from 'node:fs';
import util from 'node:util';

const readFile = util.promisify(fs.readFile);

export async function getStaticProps() {
  const body = JSON.parse(
    await readFile('pages/legal/docs/cookie-policy.json', 'utf8'),
  ).content;

  return {
    props: {
      body,
    },
  };
}

export default function CookiePolicy({ body }) {
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
