import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import { withDato } from 'lib/datocms';
import CdnMap from 'components/CdnMap';
import InterstitialTitle from 'components/InterstitialTitle';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Ill4 from 'public/images/illustrations/dato-svg-2a-01.svg';
import Quote from 'components/Quote';
import Bullets from 'components/Bullets';
import SuccessIcon from 'public/icons/regular/check-circle.svg';

import styles from './style.css';

function Developers() {
  return (
    <Layout>
      <Hero
        over="Worldwide smart CDN"
        title={
          <>
            Content, images and videos, <Highlight>all on the edge</Highlight>
          </>
        }
        subtitle={
          <>
            It’s the all-encompassing CDN-backed API for content you wish your
            company had: accessible, performant, secure, and close to every
            customer.
          </>
        }
      />

      <CdnMap />

      <div style={{ margin: '10vh 0 5vh' }}>
        <InterstitialTitle style="two">
          Delight your customers with <Highlight>lightning fast responses</Highlight>
        </InterstitialTitle>
      </div>

      <Flag
        style="good"
        title={
          <>
            An infrastructure that{' '}
            <FlagHighlight>scales&nbsp;infinitely</FlagHighlight>
          </>
        }
        image={Ill4}
      >
        <p>
        We built DatoCMS content infrastructure so you don’t have to. Focus on writing great content and creating new, innovative digital experiences. We build every day to offer a reliable solution capable of following your growth, globally, and lets you adapt along the journey, with no upfront costs.
        </p>
      </Flag>

      <Quote
        quote={
          <>
            We aired our first Super Bowl ad and <Highlight>the website performed flawlessly</Highlight>, even under high load, which was awesome. We’re transitioning all our sites to DatoCMS in the coming months.
          </>
        }
        author="Andrew Smith, Architect for web @ Little Caesars"
      />

      <Flag
        style="good"
        title={
          <>
            A unified set of <FlagHighlight>smart,&nbsp;modern&nbsp;APIs</FlagHighlight> to cover every need
          </>
        }
        image={Ill4}
      >
        <p>
          DatoCMS offers a coordinated suite of different APIs and tools to work seamlessly with the three fundamental blocks of content: text, images and video. Everything is built on CDN, optimized for speed and scalability.
        </p>

        <Bullets
          style="good"
          icon={SuccessIcon}
          bullets={[
            'Content GraphQL API',
            'Images API',
            'Video streaming API',
          ]}
        />
      </Flag>

    </Layout>
  );
}

export default withDato(Developers);
