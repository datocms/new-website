import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Legal from 'components/Legal';
import ReactMarkdown from 'react-markdown';
import fs from 'fs';
import util from 'util';

export async function unstable_getStaticProps() {
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
      <Hero
        over="Legal"
        title={
          <>
            <Highlight>Terms of Service</Highlight>
          </>
        }
      />
      <Legal><ReactMarkdown>{body}</ReactMarkdown></Legal>
    </Layout>
  );
}
