import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import s from '../style.module.css';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Nike from 'public/images/logos/nike.svg';
import Linkedin from 'public/images/logos/linkedin.svg';
import LogosBar from 'components/LogosBar';
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
              Thanks for <Highlight>contacting us</Highlight>!
            </>
          }
        />
      </Wrapper>
      <div className={s.description}>
        <p>
          We take great care of our customers and our support team will get back
          to you ASAP!
        </p>
        <br />
        In the meantime you can always search for answers in our{' '}
        <Link href="/docs">
          <a>documentation</a>
        </Link>
        , <a href="https://community.datocms.com">forum</a>,{' '}
        <Link href="/support">
          <a>contact support</a>
        </Link>
        , or you can chat live with other developers in our{' '}
        <Link href="/slack">
          <a>Slack channel</a>
        </Link>
        .
      </div>
      <div className={s.footer}>
        <LogosBar
          title="We power experiences for over half a billion users"
          clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Linkedin]}
        />
      </div>
    </Layout>
  );
}
