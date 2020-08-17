import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Showcase from 'components/Showcase';
import s from '../style.module.css';
import Head from 'next/head';
import Link from 'next/link';

export default function Support({ preview, topics }) {
  return (
    <Layout noCta preview={preview}>
      <Head>
        <title>Support page</title>
      </Head>

      <Wrapper>
        <Hero
          kicker="Support page"
          title={
            <>
              Thanks for <Highlight>contacting us</Highlight>
            </>
          }
        />
        <div className={s.description}>
          <p>Our sales team will get back to you ASAP.</p>
          <br />
          <p>In the meantime check out a few of our success stories!</p>
          <Showcase />
        </div>
      </Wrapper>
      <div className={s.footer}></div>
    </Layout>
  );
}
