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
import Head from 'components/Head';
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
              <Highlight>Thank you</Highlight> for reaching out!
            </>
          }
        />
        <div className={s.description}>
          <p>
            We take great care of our customers, our support team will be in
            touch shortly!
          </p>
          In the meantime you can perhaps look for answers in the{' '}
          <Link href="/docs">
            <a>documentation</a>
          </Link>
          , or in the official{' '}
          <a href="https://community.datocms.com">DatoCMS forum</a>.
        </div>
        <div className={s.footer}>
          <LogosBar
            title="We power experiences for over half a billion users"
            clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Linkedin]}
          />
        </div>
      </Wrapper>
    </Layout>
  );
}
