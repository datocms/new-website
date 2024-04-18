import BaseLayout from 'components/BaseLayout';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import { useRouter } from 'next/router';
import s from './style.module.css';

export default function Support() {
  const router = useRouter();

  const content = (
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
  );

  if (router.query.proxied) {
    return <BaseLayout>{content}</BaseLayout>;
  }

  return (
    <Layout noCta>
      <Head>
        <title>Agency Partner Program</title>
      </Head>

      {content}
    </Layout>
  );
}
