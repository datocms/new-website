import Bullets from 'components/Bullets';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import TitleStripWithContent from 'components/TitleStripWithContent';
import VideoPlayer from 'components/VideoPlayer';
import { gqlStaticProps, seoMetaTagsFields } from 'lib/datocms';
import Link from 'next/link';
import SuccessIcon from 'public/icons/regular/check-circle.svg';

import { range } from 'range';
import s from './style.module.css';

export const getStaticProps = gqlStaticProps(
  /* GraphQL */
  `
    {
      feature: feature(filter: { slug: { eq: "video-api" } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        slug
        seoH1
        yoastAnalysis
      }
    }
    ${seoMetaTagsFields}
  `,
);

function VideoStreamingEncoding({ feature, preview }) {
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
      <div id="main-content">
        <TitleStripWithContent
          seoAnalysis={seoAnalysis}
          kicker={'Fastest API for any video size'}
          title={<>Adaptive bitrate means fast on every device</>}
          subtitle={
            <>
              Thanks to our API&apos;s HLS Adaptive Bitrate (ABR) streaming,
              every viewer will always{' '}
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
              autoPlayAndLoop
              playbackId="goGuGfWk00LaymzN28ox44TAz00xOxea8i"
              title={keyword}
            />
          </div>
        </TitleStripWithContent>

        <Flag
          style="good"
          seoAnalysis={seoAnalysis}
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
          seoAnalysis={seoAnalysis}
          title={<>Thumbnails? Included.</>}
          subtitle={
            <>
              Thumbnails are entry level when it comes to video, yet
              implementing them is far from simple. With a{' '}
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
                  src={`https://image.mux.com/goGuGfWk00LaymzN28ox44TAz00xOxea8i/thumbnail.jpg?width=400&time=${t}`}
                  alt={feature.seoH1}
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
          seoAnalysis={seoAnalysis}
          kicker={`a flexible ${keyword}`}
          title={
            <>
              Fast, high-quality streaming video for{' '}
              <FlagHighlight>your framework of choice</FlagHighlight>
            </>
          }
        >
          <p>
            Our seamless integration with the{' '}
            <a href="https://www.mux.com/">Mux</a> video CDN makes it easy to
            serve streaming video using any video player you like, open-source
            or professional, web or native. Or, you can simply use one of our
            own <strong>DatoCMS Video Components</strong> for{' '}
            <a href="https://www.datocms.com/docs/next-js/displaying-videos">
              React/Next.js
            </a>
            ,{' '}
            <a href="https://www.datocms.com/docs/nuxt/displaying-videos">
              Vue/Nuxt
            </a>
            , or{' '}
            <a href="https://www.datocms.com/docs/svelte/displaying-videos">
              Svelte/SvelteKit
            </a>
            , for easy, drop-in video playback in your project.
          </p>
        </Flag>

        <Flag
          style="good"
          seoAnalysis={seoAnalysis}
          kicker="The best digital experience"
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
              <Link
                href="/features/real-time-api"
                title={'Real-time API'}
                key="real-time-api"
              >
                <a>Real-time updates API</a>
              </Link>,
            ]}
          />
        </Flag>
      </div>
    </Layout>
  );
}

export default VideoStreamingEncoding;
