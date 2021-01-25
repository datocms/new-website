import Layout from 'components/Layout';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Wrapper from 'components/Wrapper';
import OtherPersonasPicker from 'components/OtherPersonasPicker';
import TitleIllustrationStripWithContent from 'components/TitleIllustrationStripWithContent';
import Result from 'components/Result';
import InterstitialTitle from 'components/InterstitialTitle';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Bullets from 'components/Bullets';
import IntegrationsBanner from 'components/IntegrationsBanner';
import OmnichannelIllustration from 'components/OmnichannelIllustration';
import Quote from 'components/Quote';
import LazyImage from 'components/LazyImage';
import {
  imageFields,
  reviewFields,
  gqlStaticProps,
  seoMetaTagsFields,
} from 'lib/datocms';
import Space from 'components/Space';
import SuccessIcon from 'public/icons/regular/check.svg';

import styles from './style.module.css';

export const getStaticProps = gqlStaticProps(
  `
    query {
      page: homePage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
      integrations: allIntegrations(
        first: 30
        filter: { integrationType: { eq: "2427498" } }
      ) {
        id
        logo {
          url
        }
        squareLogo {
          url
        }
      }
      review1: review(filter: { name: { eq: "Russell Gardner" } }) {
        ...reviewFields
      }
    }
    ${imageFields}
    ${reviewFields}
    ${seoMetaTagsFields}
  `,
);

function DigitalMarketers({ integrations, preview, page, review1 }) {
  return (
    <Layout preview={preview}>
      <Head>
        {renderMetaTags(page.seo)}
        <title>DatoCMS for Digital Marketers - Team</title>
      </Head>
      <Hero
        kicker="DatoCMS for Digital Marketers"
        title={
          <>
            Win the <Highlight>omnichannel</Highlight> marketing challenge
          </>
        }
        subtitle={
          <>
            Take control of your content, and everywhere it goes. Use a unified
            platform to send content to websites, chatbots, VR/AR and IoT
            devices, without heavy IT involvement.
          </>
        }
      />

      <Space bottom={3}>
        <Wrapper>
          <OmnichannelIllustration />
        </Wrapper>
      </Space>

      <TitleIllustrationStripWithContent
        image="onichannel-matters"
        title="Why omnichannel matters?"
        subtitle={
          <>
            Many companies are delivering great content and experiences on their
            website, app, FB page and in stores. But the companies finding the
            most success are the ones who ensure that{' '}
            <strong>every interaction is consistent</strong> online and offline.
          </>
        }
      >
        <div className={styles.grid}>
          <Result
            title={
              <>
                <Highlight style="good">2x revenue growth</Highlight>
              </>
            }
          >
            According to <strong>MIT</strong>, when companies provide a seamless
            experience they generate a twice revenue rate of competitors using
            legacy digital tech
          </Result>
          <Result
            title={
              <>
                <Highlight style="good">2x customers</Highlight>
              </>
            }
          >
            <strong>Salesforce</strong> reports that more than half of shoppers
            stop buying from a company because a competitor provided a better
            experience
          </Result>
        </div>
      </TitleIllustrationStripWithContent>

      <Space top={4} bottom={3}>
        <InterstitialTitle style="two">
          DatoCMS helps you build better{' '}
          <Highlight>digital&nbsp;experiences</Highlight>
        </InterstitialTitle>
      </Space>

      <Flag
        style="good"
        title={
          <>
            Structured, unified content means{' '}
            <FlagHighlight>future&#8209;proof</FlagHighlight>
          </>
        }
        image="eye-gazing"
      >
        <p>
          Keep content separate from presentation, uncluttered by code or
          formatting, so it's ready to flow into new digital experiences without
          months of effort.
        </p>

        <Bullets
          style="good"
          icon={SuccessIcon}
          bullets={[
            'Build channel-agnostic content, reusable across touchpoints',
            'Publish changes instantly to all your channels',
            'Provide personalized, contextual help by linking resources together',
          ]}
        />
      </Flag>

      <IntegrationsBanner
        title={<>Easily connect any MarTech&nbsp;tool</>}
        bubbles={integrations.map((integration) => (
          <LazyImage
            key={integration.id}
            src={
              integration.squareLogo
                ? integration.squareLogo.url
                : integration.logo.url
            }
          />
        ))}
      >
        Easily integrate your CMS with your preferred marketing technologies,
        Marketo, Salesforce, Google Analytics, SEMrush, Brightcove, Watson, etc.
        so you can get valuable insights to make meaningful business decisions.
      </IntegrationsBanner>

      <Flag
        style="good"
        title={
          <>
            Launch new campaigns <FlagHighlight>in&nbsp;minutes</FlagHighlight>
          </>
        }
        image="go-mobile"
      >
        <p>
          Whether you’re looking to launch a landing page, microsite, brand
          site, a new experience, or something in between, launch campaigns
          faster with less IT friction.
        </p>

        <Bullets
          style="good"
          icon={SuccessIcon}
          bullets={[
            'Built-in landing page builder',
            'Flexible, adaptable content model',
            'Easily find and reuse assets with AI-assisted DAM',
          ]}
        />
      </Flag>

      <Quote review={review1} />

      <Flag
        style="good"
        title={
          <>
            Streamline <FlagHighlight>SEO</FlagHighlight>
          </>
        }
        image="zen"
      >
        <p>
          Take full control over meta titles, descriptions, social shares, URL
          paths, and more. DatoCMS automates these tasks so you never have to
          worry about your content editor forgetting meta content, but SEO teams
          still retain flexibility to optimize those fields.
        </p>

        <Bullets
          style="good"
          icon={SuccessIcon}
          bullets={[
            'Automatic SEO generation',
            'Built-in SEO editor with validations',
            'Google SERP, Facebook and Twitter cards preview',
          ]}
        />
      </Flag>

      <Flag
        style="good"
        title={
          <>
            Deliver <FlagHighlight>blazing-fast</FlagHighlight> digital products
          </>
        }
        image="rocket"
      >
        <p>
          Your customers will experience sub-second page load times without any
          additional optimization on your end. Even large photos are
          automatically optimized and resized without losing quality, so you can
          serve up the best content without sacrificing speed.
        </p>

        <Bullets
          style="good"
          icon={SuccessIcon}
          bullets={[
            "Easily achieve 100/100 on Google's PageSpeed Insight",
            'Highly optimized images and video streaming',
            'A globally delivered network at your service',
          ]}
        />
      </Flag>

      <OtherPersonasPicker
        title="Not just for digital marketers"
        currentPersonas="digital-marketers"
      />
    </Layout>
  );
}

export default DigitalMarketers;
