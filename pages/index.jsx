import Bullets from 'components/Bullets';
import Button from 'components/Button';
import Checks from 'components/Checks';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import InterstitialTitle from 'components/InterstitialTitle';
import Layout from 'components/Layout';
import LogosBar from 'components/LogosBar';
import OmnichannelIllustration from 'components/OmnichannelIllustration';
import PersonasPicker from 'components/PersonasPicker';
import Result from 'components/Result';
import Space from 'components/Space';
import TitleStripWithContent from 'components/TitleStripWithContent';
import UseCaseExcerpts from 'components/UseCaseExcerpts';
import Wrapper from 'components/Wrapper';
import { gqlStaticProps, seoMetaTagsFields } from 'lib/datocms';
import { renderMetaTags } from 'react-datocms';

import SuccessIcon from 'public/icons/regular/check.svg';
import WarningIcon from 'public/icons/regular/times.svg';

import Dropbox from 'public/images/logos/dropbox.svg';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import Polestar from 'public/images/logos/polestar.svg';
import Vercel from 'public/images/logos/vercel.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Vmware from 'public/images/logos/vmware.svg';

import Arduino from 'public/images/logos/arduino.svg';
import CityOfSidney from 'public/images/logos/cityofsidney.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import LinkedIn from 'public/images/logos/linkedin.svg';

import Afsp from 'public/images/logos/new/afsp.svg';
import Harrys from 'public/images/logos/new/harrys.svg';
import LittleCaesars from 'public/images/logos/new/little-caesars.svg';
import Mit from 'public/images/logos/new/mit.svg';
import Nhs from 'public/images/logos/new/nhs.svg';
import Oberlo from 'public/images/logos/new/oberlo.svg';

import styles from './style.module.css';

export const getStaticProps = gqlStaticProps(
  /* GraphQL */
  `
    query {
      page: homePage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        yoastAnalysis
      }
      successStories: allSuccessStories(
        first: 4
        orderBy: _firstPublishedAt_DESC
      ) {
        accentColor {
          hex
        }
        duotoneColor1 {
          hex
        }
        duotoneColor2 {
          hex
        }
        title {
          value
        }
        slug
        logo {
          url
        }
      }
    }

    ${seoMetaTagsFields}
  `,
);

function Homepage({ successStories, preview, page }) {
  return (
    <Layout preview={preview}>
      <Head>{page && renderMetaTags(page.seo)}</Head>
      <Hero
        seoAnalysis={page.yoastAnalysis}
        kicker={`${page.yoastAnalysis.keyword}, done right`}
        title={
          <>
            Simply put, the most complete, user-friendly and performant{' '}
            <Highlight>Headless&nbsp;CMS</Highlight>
          </>
        }
        subtitle={
          <>
            It&#39;s the headless CMS for the modern web. More than 25,000
            businesses use DatoCMS to create online content at scale from a
            central hub and distribute it via API.
          </>
        }
      >
        <Checks checks={['No credit card', 'Easy setup']}>
          <div className={styles.buttonGroup}>
            <Button fs="big" as="a" href="https://dashboard.datocms.com/signup">
              Sign up for free
            </Button>
            <Button
              fs="big"
              as="a"
              s="invert"
              href="https://try.datocms.com"
              target="_blank"
            >
              Try our interactive demo ⤑
            </Button>
          </div>
        </Checks>
      </Hero>

      <LogosBar
        clients={[
          <Vercel key="Vercel" />,
          <Dropbox key="Dropbox" />,
          <Hashicorp key="Hashicorp" />,
          <Verizon key="Verizon" />,
          <Vmware key="Vmware" />,
          <Polestar key="Polestar" />,
          <Arduino key="Arduino" />,
          <CityOfSidney key="CityOfSidney" />,
          <DeutscheTelekom key="DeutscheTelekom" />,
          <LinkedIn key="LinkedIn" />,
          <Oberlo key="Oberlo" />,
          <Nhs key="Nhs" />,
          <LittleCaesars key="LittleCaesars" />,
          <Mit key="Mit" />,
          <Afsp key="Afsp" />,
          <Harrys key="Harrys" />,
        ]}
      />
      <div id="main-content">
        <Space top={3}>
          <PersonasPicker />
        </Space>

        <Space top={3}>
          <InterstitialTitle subtitle="Three symptoms to&nbsp;watch&nbsp;out">
            Are you losing money because of{' '}
            <Highlight>legacy&nbsp;content infrastructure</Highlight>?
          </InterstitialTitle>
        </Space>

        <Flag
          seoAnalysis={page.yoastAnalysis}
          style="bad"
          title={
            <>
              Is content spread across{' '}
              <FlagHighlight style="bad">endless different CMSs?</FlagHighlight>
            </>
          }
          image="random-things"
        >
          <p>
            How can you deliver a cohesive brand and message strategy if your
            company functions in silos and information is manually copy-pasted
            across tens of different platforms? A headless CMS allows you to
            manage your content in one place.
          </p>
          <Bullets
            style="bad"
            icon={WarningIcon}
            bullets={[
              'Out-of-sync content',
              'Redundant expenses',
              'Internal inefficiencies',
            ]}
          />
        </Flag>

        <Flag
          seoAnalysis={page.yoastAnalysis}
          style="bad"
          title={
            <>
              Are you slowed down&nbsp;by{' '}
              <FlagHighlight style="bad">legacy&nbsp;technology?</FlagHighlight>
            </>
          }
          image="stale-flower"
        >
          <p>
            Your customers demand blazing-fast digital products, web standards
            are evolving at the speed of light, yet you rely on 15-years-old
            solutions like WordPress that force you to deliver heavy,
            low-quality user experiences.
          </p>
          <Bullets
            style="bad"
            icon={WarningIcon}
            bullets={[
              'Slow development times',
              'Rigid structures and models',
              'Poor performance in websites and apps',
            ]}
          />
        </Flag>

        <Flag
          seoAnalysis={page.yoastAnalysis}
          style="bad"
          title={
            <>
              Is your infrastructure{' '}
              <FlagHighlight style="bad">
                ready&nbsp;for&nbsp;scale?
              </FlagHighlight>
            </>
          }
          image="waves"
        >
          <p>
            New channels, new markets, complex use cases, fast iterations. You
            can no longer afford to think locally. You need to have a reliable
            solution that is capable of following your growth, globally, and
            lets you adapt along the journey.
          </p>
          <Bullets
            style="bad"
            icon={WarningIcon}
            bullets={[
              'Complex data migrations',
              'Slow access times',
              'Missing integrations to new technology',
            ]}
          />
        </Flag>

        <TitleStripWithContent
          title={<>How much is this already costing you?</>}
          seoAnalysis={page.yoastAnalysis}
        >
          <div className={styles.grid}>
            <Result
              number="89%"
              label={
                <>
                  of <Highlight style="bad">customer loss</Highlight>
                </>
              }
            >
              According to{' '}
              <a
                href="https://blogs.gartner.com/jake-sorofman/gartner-surveys-confirm-customer-experience-new-battlefield"
                target="_blank"
                rel="noreferrer"
              >
                <strong>Gartner</strong>
              </a>
              , 89 percent of companies plan to compete primarily on the basis
              of CX this year.
            </Result>
            <Result
              number="86%"
              label={
                <>
                  of buyers <Highlight style="warning">pay more</Highlight>
                </>
              }
            >
              <a
                href="https://www.oracle.com/us/products/applications/cust-exp-impact-report-epss-1560493.pdf"
                target="_blank"
                rel="noreferrer"
              >
                <strong>Harris</strong>
              </a>{' '}
              found 86% of consumers stop interacting&#8203;/&#8203;buying from
              businesses if they have a bad experience.
            </Result>
            <Result
              number="25%"
              label={
                <>
                  <Highlight style="good">in profitability</Highlight>
                </>
              }
            >
              <a
                href="https://www.oracle.com/a/ocom/docs/applications/siebel/wp-powering-cross-channel-customer-experience.pdf"
                target="_blank"
                rel="noreferrer"
              >
                <strong>Oracle</strong>
              </a>{' '}
              reported that multichannel integration has the ability to increase
              profitability by 25 percent.
            </Result>
          </div>
        </TitleStripWithContent>

        <Space top={4} bottom={2}>
          <InterstitialTitle style="two">
            Here&apos;s how a headless&nbsp;CMS can&nbsp;help&nbsp;your company
          </InterstitialTitle>
        </Space>

        <Space top={2}>
          <Wrapper>
            <OmnichannelIllustration />
          </Wrapper>
        </Space>

        <Flag
          kicker="headless CMS as a content platform"
          seoAnalysis={page.yoastAnalysis}
          style="good"
          image="box-things"
          title={
            <>
              Manage all your content{' '}
              <FlagHighlight>in&nbsp;one&nbsp;place</FlagHighlight>
            </>
          }
        >
          <p>
            Headless CMS means keeping everyone on the same page, storing
            everything in a single centralized hub, making an edit and publish
            it instantly, everywhere.
          </p>
          <Bullets
            style="good"
            icon={SuccessIcon}
            bullets={[
              'Access every bit of copy, anytime',
              'Your content becomes future-proof',
              'Deliver real omnichannel experiences',
            ]}
          />
        </Flag>

        <Flag
          kicker="headless CMS boosts your workflow"
          seoAnalysis={page.yoastAnalysis}
          style="good"
          title={
            <>
              From idea to market <FlagHighlight>in&nbsp;hours</FlagHighlight>,
              not months
            </>
          }
          image="people"
        >
          <p>
            Test and iterate painlessly, no matter what’s the digital product
            you’re working on, without reaching out to your IT for complex
            migrations.
          </p>
          <Bullets
            style="good"
            icon={SuccessIcon}
            bullets={[
              'Flexible content model',
              'Fast iterations, instant prototyping',
              'Repeatable architecture for all your projects',
            ]}
          />
        </Flag>

        <Flag
          kicker="Your project cannot be faster"
          seoAnalysis={page.yoastAnalysis}
          style="good"
          title={
            <>
              A <FlagHighlight>global delivery network</FlagHighlight> at your
              service
            </>
          }
          image="muscles"
        >
          <p>
            With a network that spans 200 cities in more than 90 countries, you
            can be sure your content is always accessible, performant, secure,
            and close to every customer.
          </p>
          <Bullets
            style="good"
            icon={SuccessIcon}
            bullets={[
              'Reduced architectural complexities',
              'Scalability is built-in',
              'Integrations ready with any digital product',
            ]}
          />
        </Flag>

        {successStories && <UseCaseExcerpts cases={successStories} />}
      </div>
    </Layout>
  );
}

export default Homepage;
