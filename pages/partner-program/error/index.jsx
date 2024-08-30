import Head from 'components/Head';
import Hero from 'components/Hero';
import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import s from './style.module.css';

export default function Support({ preview, topics }) {
  return (
    <Layout finalCta={false} preview={preview}>
      <Head>
        <title>Agency Partner Program</title>
      </Head>

      <Wrapper>
        <Hero
          kicker="Agency Partner Program"
          title={<>Something went wrong!</>}
        />
        <div className={s.description}>
          <p>
            There was an error submitting the form! Please send a mail to
            support@datocms.com to get in touch with us!
          </p>
        </div>
      </Wrapper>
      <div className={s.footer} />
    </Layout>
  );
}
