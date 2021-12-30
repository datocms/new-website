import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Head from 'components/Head';
import fs from 'fs';
import util from 'util';
import s from './style.module.css';
import ReactMarkdown from 'react-markdown';
import InterstitialTitle from 'components/InterstitialTitle';

const readFile = util.promisify(fs.readFile);

export async function getStaticProps() {
  const body = await readFile('pages/pricing/agencies/letter.md', 'utf8');

  return {
    props: {
      body,
    },
  };
}

export default function Agencies({ body }) {
  return (
    <Layout>
      <Head>
        <title>Special pricing for agencies - DatoCMS</title>
      </Head>

      <InterstitialTitle
        seoAnalysis={{ keyword: 'agencies', synonyms: '', relatedKeywords: [] }}
        kicker="Special agencies pricing"
        style="one"
      >
        Are you an Agency?
        <br />
        Here&apos;s our deal <Highlight>for you</Highlight>.
      </InterstitialTitle>

      <div className={s.pre}>
        If you own a web agency, this is a letter from us. Hope you find two
        minutes to read it!
      </div>

      <div className={s.body}>
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>
    </Layout>
  );
}
