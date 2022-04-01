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
import RealtimeUpdatesDemo from 'components/RealtimeUpdatesDemo';
import TitleStripWithContent from 'components/TitleStripWithContent';
import Quote from 'components/Quote';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import VideoPlayer from 'components/VideoPlayer';
import Bullets from 'components/Bullets';
import SuccessIcon from 'public/icons/regular/check-circle.svg';
import Button from 'components/Button';
import Link from 'next/link';
import s from './style.module.css';

export const getStaticProps = gqlStaticProps(
  /* GraphQL */
  `
    {
      feature: feature(filter: { slug: { eq: "real-time-api" } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        slug
        seoH1
        yoastAnalysis
      }
      review: review(filter: { name: { eq: "Martijn Theuwissen" } }) {
        ...reviewFields
      }
    }
    ${seoMetaTagsFields}
    ${imageFields}
    ${reviewFields}
  `,
);

function RealTime({ feature, preview, review }) {
  const seoAnalysis = feature.yoastAnalysis;
  const { keyword } = seoAnalysis;

  return (
    <Layout preview={preview}>
      <Head seo={feature.seo} slug={feature.slug} />
      <Hero
        seoAnalysis={seoAnalysis}
        kicker={feature.seoH1}
        title={
          <>
            Real-time edits, on&nbsp;your{' '}
            <Highlight>production&nbsp;website</Highlight>
          </>
        }
        subtitle={
          <>
            Say goodbye to dedicated preview servers. Thanks to{' '}
            <strong>our real-time API</strong>, you will completely change the
            way you work and interact with your content{' '}
            <strong>
              with just a couple of lines of code on your frontend website.
            </strong>{' '}
          </>
        }
      />
      <div id="main-content">
        <TitleStripWithContent
          seoAnalysis={seoAnalysis}
          kicker="Real-time API + content preview"
          title={<>Preview changes as they get authored, no refresh needed</>}
          subtitle={
            <>
              Instead of the API consumer only getting the new data upon their
              next query, with{' '}
              <strong>
                DatoCMS&#39;s Real-time Updates, new data is instantly pushed to
                them
              </strong>
              .
            </>
          }
        >
          <div className={s.video}>
            <VideoPlayer
              controls
              autoPlay
              title={keyword}
              src="https://stream.mux.com/5Tz902WgAavFoB025U5eNZ5fHubUk6tzwa.m3u8"
            />
          </div>
        </TitleStripWithContent>

        <Quote review={review} />

        <Flag
          seoAnalysis={seoAnalysis}
          style="good"
          kicker="Live real-time API"
          title={
            <>
              Need to <FlagHighlight>cover live events</FlagHighlight> as they
              happen?
            </>
          }
          image={RealtimeUpdatesDemo}
        >
          <p>
            The same API used to preview draft content can also be applied to
            offer{' '}
            <strong>
              real-time updates to your website&#39;s final visitors
            </strong>
            . Our infrastructure can{' '}
            <strong>easily handle thousands of live users</strong> with multiple
            updates per minute.
          </p>
          <p>
            <Button
              as="a"
              fs="small"
              p="small"
              s="invert"
              href="/marketplace/starters/next-js-event-coverage-liveblog"
              title="Next.js real-time"
            >
              Try the Live-blog demo for Next.js
            </Button>
          </p>
        </Flag>

        <Flag
          seoAnalysis={seoAnalysis}
          kicker={'Real-time GraphQL API'}
          style="good"
          title={
            <>
              GraphQL and Server-Sent Events, to deliver the{' '}
              <FlagHighlight>best developer ergonomic</FlagHighlight>
            </>
          }
          image="live"
        >
          <p>
            The Real-time Updates API uses <em>Server-Sent Events</em>, which is
            a protocol supported natively from all modern browsers, to{' '}
            <strong>
              transform your regular GraphQL into streaming subscriptions
            </strong>
            . Using our React and Vue libraries you can{' '}
            <strong>get started in literally seconds</strong>.
          </p>
          <Button
            as="a"
            fs="small"
            p="small"
            s="invert"
            href="/docs/real-time-updates-api"
            title="Real-time API docs"
          >
            Learn more in the Docs
          </Button>
        </Flag>
        <Flag
          style="good"
          seoAnalysis={seoAnalysis}
          kicker={`APIs + Worldwide CDN`}
          title={
            <>
              A complete set of{' '}
              <FlagHighlight>smart,&nbsp;modern&nbsp;APIs</FlagHighlight>
            </>
          }
          image="zen"
        >
          <p>
            DatoCMS does not only offer a powerful real-time API but a full
            coordinated suite of different <strong>APIs and tools</strong> to
            work seamlessly with the three fundamental blocks of content:{' '}
            <strong>text, images and video</strong>. Everything is built on CDN,{' '}
            <strong>optimized for speed and scalability</strong>.
          </p>

          <Bullets
            style="good"
            icon={SuccessIcon}
            bullets={[
              <Link
                href="/features/images-api"
                title={'Images API'}
                key="images-api"
              >
                <a>Images API</a>
              </Link>,
              <Link
                href="/features/video-api"
                title={'Video API'}
                key="video-api"
              >
                <a>Video API</a>
              </Link>,
              <Link
                href="/features/worldwide-cdn"
                title={'Fastest headless CMS CDN'}
                key="worldwide-cdn"
              >
                <a>Worldwide CDN</a>
              </Link>,
              <Link
                href="/features/headless-cms-graphql"
                title={'Headless CMS GraphQL'}
                key="graphql-api"
              >
                <a>Content GraphQL API</a>
              </Link>,
            ]}
          />
        </Flag>
      </div>
    </Layout>
  );
}

export default RealTime;
