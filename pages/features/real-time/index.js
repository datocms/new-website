import Layout from 'components/Layout';
import Head from 'next/head';
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
import Button from 'components/Button';
import s from './style.module.css';

export const getStaticProps = gqlStaticProps(
  `
    {
      page: homePage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
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

function ImagesApi({ page, preview, review }) {
  return (
    <Layout preview={preview}>
      <Head>
        {renderMetaTags(page.seo)}
        <title>Real-time updates and preview - Features</title>
      </Head>

      <Hero
        kicker="Real-time updates"
        title={
          <>
            Real-time edits, on&nbsp;your{' '}
            <Highlight>production&nbsp;website</Highlight>
          </>
        }
        subtitle={
          <>
            Say goodbye to dedicated preview servers. A couple of lines of code
            on your frontend website are sufficient to completely change the way
            you work and interact with your content.
          </>
        }
      />

      <TitleStripWithContent
        title={<>Preview changes as they get authored, no refresh needed</>}
        subtitle={
          <>
            Instead of the API consumer only getting the new data upon their
            next query, with DatoCMS's Real-time Updates API, new data is
            instantly pushed to them.
          </>
        }
      >
        <div className={s.video}>
          <VideoPlayer
            controls
            autoPlay
            muted
            loop
            src="https://stream.mux.com/5Tz902WgAavFoB025U5eNZ5fHubUk6tzwa.m3u8"
          />
        </div>
      </TitleStripWithContent>

      <Quote review={review} />

      <Flag
        style="good"
        title={
          <>
            Need to <FlagHighlight>cover live events</FlagHighlight> as they
            happen?
          </>
        }
        image={RealtimeUpdatesDemo}
      >
        <p>
          The same Real-time Updates API used to preview draft content can also
          be applied to offer real-time updates to your website's final
          visitors. Our infrastructure can easily handle thousands of live users
          with multiple updates per minute.
        </p>
        <p>
          <Button
            as="a"
            fs="small"
            p="small"
            s="invert"
            href="/marketplace/starters/next-js-event-coverage-liveblog"
          >
            Try the Live-blog demo for Next.js
          </Button>
        </p>
      </Flag>

      <Flag
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
          The Real-time Updates API uses <em>Server-Sent Events</em>, which is a
          protocol supported natively from all modern browsers, to transform
          your regular GraphQL into streaming subscriptions. Using our our
          libraries for React and Vue you can get started in literally seconds.
        </p>
        <Button
          as="a"
          fs="small"
          p="small"
          s="invert"
          href="/docs/real-time-updates-api"
        >
          Learn more in the Docs
        </Button>
      </Flag>
    </Layout>
  );
}

export default ImagesApi;
