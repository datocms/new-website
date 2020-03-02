import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import Link from 'next/link';
import s from './style.css';
import TalkWithUs from 'components/TalkWithUs';
import Highlight from 'components/Highlight';

export default function Support() {
  return (
    <Layout noCta>
      <div className={s.root}>
        <Wrapper>
          <div className={s.rootInner}>
            <div className={s.intro}>
              <div className={s.introKicker}>Get in touch with us</div>
              <div className={s.introTitle}>
                Find out how DatoCMS can help{' '}
                <Highlight>your company</Highlight>
              </div>
              <div className={s.introBody}>
                <p>
                  Whether you’re a potential user with questions about our
                  product and you would like to get a demo, or are already using
                  DatoCMS and have questions about expanding your current
                  package, we’re ready to help.
                </p>

                <p>
                  Fill out the form below and one of our sales expert we’ll
                  be in touch as soon as possible.
                </p>

                <p className={s.support}>
                  Need technical support? Please visit our{' '}
                  <Link href="/support">
                    <a>Support page</a>
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className={s.picker}>
              <TalkWithUs />
            </div>
          </div>
        </Wrapper>
      </div>
    </Layout>
  );
}
