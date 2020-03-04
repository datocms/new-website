import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Legal from 'components/Legal';
import ReactMarkdown from 'react-markdown';

import fs from 'fs';
import util from 'util';

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
      <Hero
        over="Legal"
        title={
          <>
            <Highlight>DatoCMS Security</Highlight>
          </>
        }
        subtitle="We care about protecting your work, from the ground up"
      />
      <Legal><ReactMarkdown>{body}</ReactMarkdown></Legal>
    </Layout>
  );
}

