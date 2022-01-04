import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import s from './style.module.css';
import Head from 'components/Head';

export default function Support({ preview, topics }) {
  return (
    <Layout noCta preview={preview}>
      <Head>
        <title>Agency Partner Program</title>
      </Head>

      <Wrapper>
        <Hero
          kicker="Agency Partner Program"
          title={
            <>
              <Highlight>Thank you</Highlight> for reaching out!
            </>
          }
        />
        <div className={s.description}>
          <p>Thank you for your interest in our Partner Program!</p>
          <p>
            We will respond to your inquiry shortly, and will try to schedule a
            brief 15-minute informational chat so we can better understand your
            needs and how we can be of service to you.
          </p>
          <p>We really can&apos;t wait to know more about you!</p>
        </div>
      </Wrapper>
      <div className={s.footer}></div>
    </Layout>
  );
}
