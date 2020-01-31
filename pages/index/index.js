import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Button from 'components/Button';
import Checks from 'components/Checks';
import UseCases from 'components/UseCases';
import Numbers, { Block as NumbersBlock } from 'components/Numbers';
import PersonasPicker from 'components/PersonasPicker';
import InterstitialTitle from 'components/InterstitialTitle';
import Flag from 'components/Flag';
import Bullets from 'components/Bullets';
import Quote from 'components/Quote';
import LogosBar from 'components/LogosBar';
import { withDato } from 'lib/datocms';

import Ill1 from 'public/images/illustrations/dato-svg-4-02.svg';
import Ill2 from 'public/images/illustrations/dato-svg-3a-01.svg';
import Ill3 from 'public/images/illustrations/dato-svg-5-03.svg';
import Icon from 'public/icons/regular/exclamation-circle.svg';
import styles from './style.css';

function Homepage() {
  return (
    <Layout>
      <Hero
        title={
          <>
            The&nbsp;best&nbsp;companies are&nbsp;built&nbsp;on{' '}
            <Highlight>unified&nbsp;content</Highlight>
          </>
        }
        subtitle={
          <>
            More than 4.000 businesses use DatoCMS to create their online
            content at scale from a central hub, and distribute it easily via
            API to websites and any other digital experience.
          </>
        }
      >
        <Checks checks={['No credit card', 'Easy setup']}>
          <Button fs="big">Try it now for free!</Button>
        </Checks>
      </Hero>

      <LogosBar />

      <div style={{ margin: '15vh 0' }}>
        <InterstitialTitle subtitle="Here’s 3 symptoms to watch out">
          Are you losing money because of{' '}
          <Highlight>legacy content&nbsp;infrastructure</Highlight>?
        </InterstitialTitle>
      </div>

      <Flag
        title={
          <>
            Is content spread across{' '}
            <Highlight>endless different CMSs</Highlight>?
          </>
        }
        image={<Ill1 preserveAspectRatio="xMinyMin meet" />}
      >
        <p>
          How can you deliver a cohesive brand and message strategy if your
          company functions in silos and information is manually copy-pasted
          across tens of different platforms?
        </p>
        <Bullets
          icon={Icon}
          bullets={[
            'Out-of-sync content',
            'Redundant expenses',
            'Internal inefficiencies',
          ]}
        />
      </Flag>

      <Flag
        title={
          <>
            Are you slowed down by{' '}
            <Highlight>legacy&nbsp;technology?</Highlight>
          </>
        }
        image={<Ill2 />}
      >
        <p>
          How can you deliver a cohesive brand and message strategy if your
          company functions in silos and information is manually copy-pasted
          across tens of different platforms?
        </p>
        <Bullets
          icon={Icon}
          bullets={[
            'Slow development times',
            'Rigid structures and models',
            'Low-performant websites and apps',
          ]}
        />
      </Flag>

      <Flag
        title={
          <>
            Is your infrastructure{' '}
            <Highlight>ready&nbsp;for&nbsp;scale?</Highlight>
          </>
        }
        image={<Ill3 />}
      >
        <p>
          New channels, new markets, complex use cases, fast iterations. You can
          no longer afford to think locally. You need to have a reliable
          solution that is capable of following your growth, globally, and lets
          you adapt along the journey.
        </p>
        <Bullets
          icon={Icon}
          bullets={[
            'Complex data migrations',
            'Slow access times',
            'Missing integrations to new technology',
          ]}
        />
      </Flag>

      <Numbers title="Why you should use DatoCMS">
        <NumbersBlock title="-79%">
          Operational costs for Hashicorp
        </NumbersBlock>
        <NumbersBlock title="30.000">
          Monthly transactions for Chilli's Bottles
        </NumbersBlock>
        <NumbersBlock title="300%">Time-to-market for for Nike</NumbersBlock>
      </Numbers>

      <PersonasPicker />

      <UseCases />
    </Layout>
  );
}

export default withDato(Homepage);
