import Layout from 'components/Layout';
import Head from 'components/Head';
import { renderMetaTags } from 'react-datocms';
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
import Link from 'next/link';

export const getStaticProps = gqlStaticProps(
  `
    query {
      feature: feature(filter: { slug: { eq: "worldwide-cdn" } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        slug
        seoH1
        yoastAnalysis
      }
      review1: review(filter: { name: { eq: "Grace Guzman" } }) {
        ...reviewFields
      }
    }

    ${imageFields}
    ${reviewFields}
    ${seoMetaTagsFields}
  `,
);

function WorldwideCdn({ preview, review1, feature }) {
  const seoBlock = feature && feature.yoastAnalysis;
  const keyword = yoastAnalysis;
  return (
    <Layout preview={preview}>
      <Head seo={feature.seo} slug={feature.slug} />
      <Hero
        kicker={seoBlock.h1}
        keyword={seoBlock.keyword}
        title={
          <>
            Content, images and videos,{' '}
            <Highlight>all&nbsp;on&nbsp;the&nbsp;edge</Highlight>
          </>
        }
        subtitle={
          <>
            It’s the all-encompassing CDN-backed API for content you wish your
            company had:{' '}
            <strong>
              accessible, performant, secure, and close to every customer
            </strong>
            .
          </>
        }
      />
      <div id="main-content">
        <CdnMap />

        <Space top={2} bottom={1}>
          <InterstitialTitle style="two">
            Delight your customers with{' '}
            <Highlight>lightning fast responses</Highlight>
          </InterstitialTitle>
        </Space>

        <Flag
          style="good"
          keyword={seoBlock.keyword}
          kicker="Fast & scalable headless CMS"
          title={
            <>
              An infrastructure that{' '}
              <FlagHighlight>scales&nbsp;infinitely</FlagHighlight>
            </>
          }
          image="space"
        >
          <p>
            We built DatoCMS content infrastructure so you don’t have to. Focus
            on writing great content and creating new, innovative digital
            experiences. We work every day to offer a{' '}
            <strong>reliable solution capable of following your growth</strong>,
            globally, and lets you adapt along the journey, with{' '}
            <strong>no upfront costs</strong>.
          </p>
        </Flag>

        <Quote review={review1} />

        <Numbers>
          <NumbersBlock title="74">CDN Edges</NumbersBlock>
          <NumbersBlock title="50TB">Data served daily</NumbersBlock>
          <NumbersBlock title="150M">Requests per week</NumbersBlock>
          <NumbersBlock title="99.99%">Guaranteed uptime</NumbersBlock>
        </Numbers>

        <Flag
          style="good"
          keyword={seoBlock.keyword}
          title={
            <>
              A unified set of{' '}
              <FlagHighlight>smart,&nbsp;modern&nbsp;APIs</FlagHighlight> to
              cover every need
            </>
          }
          image="zen"
        >
          <p>
            DatoCMS offers a coordinated suite of different{' '}
            <strong>APIs and tools</strong> to work seamlessly with the three
            fundamental blocks of content:{' '}
            <strong>text, images and video</strong>. Everything is built on CDN,{' '}
            <strong>optimized for speed and scalability</strong>, making it the
            fastest headless CMS.
          </p>

          <Bullets
            style="good"
            icon={SuccessIcon}
            bullets={[
              <Link
                href="/features/headless-cms-graphql"
                title={'Headless CMS GraphQL'}
                key="graphql-api"
              >
                <a>Content GraphQL API</a>
              </Link>,
              'Real-time updates API',
              <Link
                href="/features/images-api"
                title={'Images API'}
                key="images-api"
              >
                <a>Images API</a>
              </Link>,
              <Link
                href="/features/video-api"
                title={'Videos API'}
                key="video-api"
              >
                <a>Videos API</a>
              </Link>,
            ]}
          />
        </Flag>

        <Flag
          style="good"
          keyword={seoBlock.keyword}
          kicker="Is Dato the fastest headless CMS?"
          title={
            <>
              Obsessed by <FlagHighlight>Performance and speed</FlagHighlight>
            </>
          }
          image="corona2"
        >
          <p>
            Being optimized for lazy image serving, video streaming, and
            depth-first content delivery, DatoCMS is surely one of the{' '}
            <strong>fastest headless CMSs</strong>. On top of that performance
            is one of our top day-by-day concerns.
          </p>
        </Flag>
      </div>
    </Layout>
  );
}

export default WorldwideCdn;
