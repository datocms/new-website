import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Wrapper from 'components/Wrapper';
import Head from 'components/Head';
import fs from 'fs';
import util from 'util';
import s from './style.module.css';
import ReactMarkdown from 'react-markdown';
import Signature from 'public/images/signature.svg';

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

      <Hero
        seoAnalysis={{ keyword: 'agencies', synonyms: '', relatedKeywords: [] }}
        kicker="Agency partner program"
        title={
          <>
            Agencies,&nbsp;we&apos;ve&nbsp;got a special&nbsp;deal{' '}
            <Highlight>for you</Highlight>.
          </>
        }
      />

      <Wrapper>
        <div className={s.pre}>
          We couldn&apos;t find a better way to talk to you about this, so
          here&apos;s a letter from us. Have a read!
        </div>
      </Wrapper>

      <div className={s.letter}>
        <ReactMarkdown>{body}</ReactMarkdown>
        <div className={s.signature}>
          <Signature />
          <div>Stefano, and all the DatoCMS team</div>
        </div>
      </div>
    </Layout>
  );
}
