import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import Hero from 'components/Hero';
import s from '../style.module.css';
import Head from 'components/Head';

export default function Support({ preview, topics }) {
  return (
    <Layout noCta preview={preview}>
      <Head>
        <title>Get in touch with us</title>
      </Head>

      <Wrapper>
        <Hero
          kicker="Get in touch with us"
          title={<>Something went wrong!</>}
        />
        <div className={s.description}>
          <p>
            There was an error submitting the form! Please send a mail to
            support@datocms.com to get in touch with us!
          </p>
        </div>
      </Wrapper>
      <div className={s.footer}></div>
    </Layout>
  );
}
