import Layout from 'components/Layout';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import { gqlStaticProps, seoMetaTagsFields } from 'lib/datocms';
import Hero from 'components/Hero/Seo';
import Highlight from 'components/Highlight';
import VideoPlayer from 'components/VideoPlayer';
import TitleStripWithContent from 'components/TitleStripWithContent/Seo';
import Flag, { Highlight as FlagHighlight } from 'components/Flag/Seo';
import Ill4 from 'public/images/illustrations/dato-svg-2a-01.svg';
import Bullets from 'components/Bullets';
import SuccessIcon from 'public/icons/regular/check-circle.svg';
import Link from 'next/link';

import s from './style.module.css';
import { range } from 'range';

export const getStaticProps = gqlStaticProps(
  `
    {
      feature: feature(filter: { slug: { eq: "video-api" } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        slug
        seoContent {
          ... on SeoBlockRecord {
            keyword
            h1
            imagesTitle
            metaKeywords
          }
        }
      }
    }
    ${seoMetaTagsFields}
  `,
);

function VideoStreamingEncoding({ feature, preview }) {
  const seoBlock = feature && feature.seoContent[0];

  return (
    <Layout preview={preview}>
      <Head>
        <link
          rel="alternate"
          hrefLang="en"
          href={`https://datocms.com/features/${feature.slug}`}
        />
        {renderMetaTags(feature.seo)}
        {seoBlock.metaKeywords && (
          <meta name="keywords" content={seoBlock.metaKeywords} />
        )}
      </Head>

      <Hero
        keyword={seoBlock.keyword}
        kicker={seoBlock.h1}
        title={
          <>
            Stream beautifully, <Highlight>everywhere</Highlight>
          </>
        }
        subtitle={
          <>
            Empower your content team with the ability to{' '}
            <strong>produce beautiful videos</strong> and{' '}
            <strong>serve them fast</strong> to any device with our API.
          </>
        }
      />

      <TitleStripWithContent
        keyword={seoBlock.keyword}
        kicker={`Fastest API for any video size`}
        title={<>Adaptive bitrate means fast on every device</>}
        subtitle={
          <>
            Thanks to HLS Adaptive Bitrate (ABR) streaming, every viewer will
            always{' '}
            <strong>
              download the right video size for their device and connection
              speed
            </strong>
            .
          </>
        }
      >
        <div className={s.video}>
          <VideoPlayer
            controls
            autoPlay
            muted
            loop
            src="https://stream.mux.com/goGuGfWk00LaymzN28ox44TAz00xOxea8i.m3u8"
            title={seoBlock.keyword}
            description="DatoCMS video API allows you to make your videos immediately streamable"
            tag={seoBlock.keyword}
            translate="no"
          />
        </div>
      </TitleStripWithContent>

      <Flag
        style="good"
        keyword={seoBlock.keyword}
        kicker="API for all video formats"
        title={
          <>
            Any video format,{' '}
            <FlagHighlight>instantly&nbsp;streamable</FlagHighlight>
          </>
        }
        image="go-mobile"
      >
        <p>
          We can ingest almost <strong>every available codec</strong> —
          including those for broadcast and professional applications like
          H.264, H.265, VP9, and Apple ProRes — and{' '}
          <strong>make videos instantly available for streaming</strong>.
        </p>
      </Flag>

      <TitleStripWithContent
        keyword={seoBlock.keyword}
        title={<>Thumbnails? Included.</>}
        subtitle={
          <>
            Thumbnails are entry level when it comes to video, yet implementing
            them is far from simple. With a{' '}
            <strong>
              single request through our API you can get a thumbnail or an
              entire storyboard
            </strong>{' '}
            to use in your player to scrub preview images.
          </>
        }
      >
        <div className={s.frames}>
          {range(1, 12, 2).map((t) => (
            <div key={t} className={s.frame}>
              <img
                src={`https://image.mux.com/goGuGfWk00LaymzN28ox44TAz00xOxea8i/thumbnail.jpg?width=400&amp;time=${t}`}
                title={seoBlock.imagesTitle}
              />
              <div className={s.frameLabel}>
                /video/thumb.jpg?
                <span className={s.paramName}>width</span>=
                <span className={s.paramValue}>400</span>&amp;
                <span className={s.paramName}>time</span>=
                <span className={s.paramValue}>{t}</span>
              </div>
            </div>
          ))}
        </div>
      </TitleStripWithContent>

      <Flag
        style="good"
        image="video-player"
        keyword={seoBlock.keyword}
        kicker={`a flexible ${seoBlock.keyword}`}
        title={
          <>
            An API that works with{' '}
            <FlagHighlight>any&nbsp;video&nbsp;player</FlagHighlight>
          </>
        }
      >
        <p>
          Rather than require you to use a proprietary player, we made it{' '}
          <strong>
            easy to integrate with all major web and mobile video players
          </strong>
          , open-source or professional, web or native.
        </p>
      </Flag>

      <Flag
        style="good"
        keyword={seoBlock.keyword}
        kicker={`${seoBlock.keyword} + Images API + CDN`}
        title={
          <>
            A complete set of{' '}
            <FlagHighlight>smart,&nbsp;modern&nbsp;APIs</FlagHighlight>
          </>
        }
        image="zen"
      >
        <p>
          DatoCMS does not only offer a powerful video API but a full
          coordinated suite of different <strong>APIs and tools</strong> to work
          seamlessly with the three fundamental blocks of content:{' '}
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
            'Real-time updates API',
          ]}
        />
      </Flag>
    </Layout>
  );
}

export default VideoStreamingEncoding;
