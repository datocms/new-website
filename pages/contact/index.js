import Head from 'components/Head';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import LogosBar from 'components/LogosBar';
import TalkWithUs from 'components/TalkWithUs';
import Wrapper from 'components/Wrapper';
import Link from 'next/link';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import Polestar from 'public/images/logos/polestar.svg';
import Vercel from 'public/images/logos/vercel.svg';
import Verizon from 'public/images/logos/verizon.svg';
import s from './style.module.css';

export default function Support() {
  return (
    <Layout noCta>
      <Head noIndex>
        <title>Contact our Sales team</title>
      </Head>
      <div className={s.root}>
        <Wrapper>
          <div className={s.rootInner}>
            <div className={s.intro}>
              <div className={s.introKicker}>Get in touch with us</div>
              <div className={s.introTitle}>
                Contact our <Highlight>Sales&nbsp;team</Highlight>
              </div>
              <div className={s.introBody}>
                <p>
                  Whether you’re a potential user with questions about our
                  product, or are already using DatoCMS and have questions about
                  expanding your current package, we’re ready to help.
                </p>

                <p>
                  Fill out the form below and one of our sales expert we’ll be
                  in touch as soon as possible.
                </p>

                <p>
                  <b>
                    Filling all the fields helps us giving you a more informed
                    answer with less back and forth.
                  </b>{' '}
                  Also helps you thinking about your project in terms that are
                  useful for us to understand what you are up to.
                </p>

                <p className={s.support}>
                  To learn more about our self-service plans, visit our{' '}
                  <Link href="/pricing">Pricing page</Link>.
                </p>

                <p className={s.support}>
                  Need support? Please visit our{' '}
                  <Link href="/support">Support page</Link>.
                </p>
              </div>
            </div>
            <div className={s.picker}>
              <TalkWithUs
                fieldset="sales"
                initialValues={{ issueType: 'sales' }}
              />
            </div>
          </div>
        </Wrapper>
      </div>
      <LogosBar
        title="We power experiences for over half a billion users"
        clients={[
          <DeutscheTelekom key="DeutscheTelekom" />,
          <Hashicorp key="Hashicorp" />,
          <Verizon key="Verizon" />,
          <Polestar key="Polestar" />,
          <Vercel key="Vercel" />,
        ]}
      />
    </Layout>
  );
}
