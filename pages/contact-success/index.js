import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import Link from 'next/link';
import s from './style.module.css';
import Highlight from 'components/Highlight';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Nike from 'public/images/logos/nike.svg';
import Vercel from 'public/images/logos/vercel.svg';
import LogosBar from 'components/LogosBar';
import Head from 'next/head';
import Shout from 'public/images/illustrations/marketers.svg';

export default function Support() {
  return (
    <Layout noCta>
      <Head>
        <title>Thank you for contacting us!</title>
      </Head>
      <div className={s.root}>
        <Wrapper>
          <Shout className={s.image} />
          <div className={s.rootInner}>
            <div className={s.intro}>
              <div className={s.introTitle}>
                <Highlight>Thank you</Highlight> for getting in touch!
              </div>
              <div className={s.introBody}>
                <p>
                  You should get a confirmation email with more details in few
                  moments.
                </p>

                <p className={s.support}>
                  Still need support? Please visit our{' '}
                  <Link href="/support">
                    <a>Support page</a>
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
      <LogosBar
        title="We power experiences for over half a billion users"
        clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Vercel]}
      />
    </Layout>
  );
}
