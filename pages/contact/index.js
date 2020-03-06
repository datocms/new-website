import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import Link from 'next/link';
import s from './style.module.css';
import TalkWithUs from 'components/TalkWithUs';
import Highlight from 'components/Highlight';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Nike from 'public/images/logos/nike.svg';
import Linkedin from 'public/images/logos/linkedin.svg';
import LogosBar from 'components/LogosBar';
import Head from 'next/head';

export default function Support() {
  return (
    <Layout noCta>
      <Head>
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

                {/* <p>
                  Please select a topic below related to your inquiry. If you
                  don’t find what you need, fill out our contact form.
                </p>

                <ul className={s.inquiries}>
                  <li>
                    <Link href="/book-demo">
                      <a className={s.inquiry}>
                        <div className={s.inquiryTitle}>Book a demo</div>
                        <div className={s.inquiryDesc}>
                          Request a demo from one of our conversion specialists
                        </div>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/customers">
                      <a className={s.inquiry}>
                        <div className={s.inquiryTitle}>Get inspired</div>
                        <div className={s.inquiryDesc}>
                          Discover how our customers use DatoCMS
                        </div>
                      </a>
                    </Link>
                  </li>
                </ul> */}

                <p className={s.support}>
                  Need support? Please visit our{' '}
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
      <LogosBar
        title="We power experiences for over half a billion users"
        clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Linkedin]}
      />
    </Layout>
  );
}
