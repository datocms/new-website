import Layout from 'components/Layout';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import gql from 'graphql-tag';
import {
  imageFields,
  reviewFields,
  gqlStaticProps,
  seoMetaTagsFields,
} from 'lib/datocms';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import CdnMap from 'components/CdnMap';
import InterstitialTitle from 'components/InterstitialTitle';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Quote from 'components/Quote';
import Bullets from 'components/Bullets';
import SuccessIcon from 'public/icons/regular/check-circle.svg';
import Numbers, { Block as NumbersBlock } from 'components/Numbers';
import Space from 'components/Space';

export const getStaticProps = gqlStaticProps(
  gql`
    {
      page: homePage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
      review1: review(filter: { id: { eq: "4368563" } }) {
        ...reviewFields
      }
    }
    ${imageFields}
    ${reviewFields}
    ${seoMetaTagsFields}
  `,
);

function WorldwideCdn({ page, preview, review1 }) {
  return (
    <Layout preview={preview}>
      <Head>
        {renderMetaTags(page.seo)}
        <title>Worldwide smart CDN - Features</title>
      </Head>

      <Hero
        kicker="Worldwide smart CDN"
        title={
          <>
            Content, images and videos,{' '}
            <Highlight>all&nbsp;on&nbsp;the&nbsp;edge</Highlight>
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

      <Space top={2} bottom={1}>
        <InterstitialTitle style="two">
          Delight your customers with{' '}
          <Highlight>lightning fast responses</Highlight>
        </InterstitialTitle>
      </Space>

      <Flag
        style="good"
        title={
          <>
            An infrastructure that{' '}
            <FlagHighlight>scales&nbsp;infinitely</FlagHighlight>
          </>
        }
        image="space"
      >
        <p>
          We built DatoCMS content infrastructure so you don’t have to. Focus on
          writing great content and creating new, innovative digital
          experiences. We work every day to offer a reliable solution capable of
          following your growth, globally, and lets you adapt along the journey,
          with no upfront costs.
        </p>
      </Flag>

      <Quote review={review1} />

      <Numbers>
        <NumbersBlock title="74">CDN Edges</NumbersBlock>
        <NumbersBlock title="50TB">Data served daily</NumbersBlock>
        <NumbersBlock title="100M">Requests per week</NumbersBlock>
        <NumbersBlock title="99.99%">Guaranteed uptime</NumbersBlock>
      </Numbers>

      <Flag
        style="good"
        title={
          <>
            A unified set of{' '}
            <FlagHighlight>smart,&nbsp;modern&nbsp;APIs</FlagHighlight> to cover
            every need
          </>
        }
        image="zen"
      >
        <p>
          DatoCMS offers a coordinated suite of different APIs and tools to work
          seamlessly with the three fundamental blocks of content: text, images
          and video. Everything is built on CDN, optimized for speed and
          scalability.
        </p>

        <Bullets
          style="good"
          icon={SuccessIcon}
          bullets={['Content GraphQL API', 'Images API', 'Video streaming API']}
        />
      </Flag>
    </Layout>
  );
}

export default WorldwideCdn;
