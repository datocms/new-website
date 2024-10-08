import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import LogosBar from 'components/LogosBar';
import Wrapper from 'components/Wrapper';
import Link from 'next/link';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import Linkedin from 'public/images/logos/linkedin.svg';
import Nike from 'public/images/logos/nike.svg';
import Verizon from 'public/images/logos/verizon.svg';
import s from '../style.module.css';

export default function Support({ preview, topics }) {
  return (
    <Layout finalCta={false} preview={preview}>
      <Head>
        <title>Support page</title>
      </Head>

      <Wrapper>
        <Hero kicker="Support page" title={<>Something went wrong!</>} />
        <div className={s.description}>
          <p>
            There was an error submitting the form! Please send a mail to
            support@datocms.com to get in touch with us!
          </p>
        </div>
      </Wrapper>
    </Layout>
  );
}
