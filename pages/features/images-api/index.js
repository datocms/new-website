import Bullets from 'components/Bullets';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import ImgixTransformations from 'components/ImgixTransformations';
import Layout from 'components/Layout';
import ProgressiveImagesDemo from 'components/ProgressiveImagesDemo';
import Quote from 'components/Quote';
import TitleStripWithContent from 'components/TitleStripWithContent';
import {
  gqlStaticProps,
  imageFields,
  reviewFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import Link from 'next/link';
import SuccessIcon from 'public/icons/regular/check-circle.svg';

export const getStaticProps = gqlStaticProps(
  /* GraphQL */
  `
    {
      feature: feature(filter: { slug: { eq: "images-api" } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        slug
        seoH1
        yoastAnalysis
      }
      review: review(filter: { name: { eq: "Grace Guzman" } }) {
        ...reviewFields
      }
    }
    ${seoMetaTagsFields}
    ${imageFields}
    ${reviewFields}
  `,
);

function ImagesApi({ feature, preview, review }) {
  const seoAnalysis = feature.yoastAnalysis;

  return (
    <Layout preview={preview}>
      <Head seo={feature.seo} slug={feature.slug} />
      <Hero
        kicker={feature.seoH1}
        seoAnalysis={seoAnalysis}
        title={
          <>
            The easiest way to deliver{' '}
            <Highlight>fast, optimized&nbsp;images</Highlight>
          </>
        }
        subtitle={
          <>
            Serve <strong>lightning-fast images</strong> for any digital product
            with a suite of tools and APIs built to save both development time
            and visitor bandwidth.
          </>
        }
      />
      <div id="main-content">
        <TitleStripWithContent
          kicker="Best API for images processing"
          seoAnalysis={seoAnalysis}
          title="Endless image transformations at your service"
          subtitle={
            <>
              DatoCMS offers best-in-class API for{' '}
              <strong>images processing</strong> and <strong>image CDN</strong>{' '}
              thanks to the seamless{' '}
              <a href="https://imgix.com/" target="_blank" rel="noreferrer">
                partnership with Imgix
              </a>
              . <strong>Optimize, resize, crop, rotate</strong> and watermark
              images on-the-fly simply adding custom parameters to the URL of
              your image.
            </>
          }
        >
          <ImgixTransformations />
        </TitleStripWithContent>

        <Flag
          style="good"
          seoAnalysis={seoAnalysis}
          kicker="Optimized images"
          title={
            <>
              Automatically serve{' '}
              <FlagHighlight>the&nbsp;best&nbsp;output</FlagHighlight>
            </>
          }
          image="key"
        >
          <p>
            Our&nbsp;<strong>Automatic Image Optimization</strong>
            &nbsp;simplifies getting your images ready for the web. It&nbsp;
            <strong>reduces the average file size by 50%</strong>&nbsp;and
            preserves high quality, all with zero development effort on your
            side.
          </p>
        </Flag>

        <TitleStripWithContent
          kicker="Images preview"
          seoAnalysis={seoAnalysis}
          title="State of the art for responsive and progressive images"
          subtitle={
            <>
              Serving optimized images is incredibly hard, but using our GraphQL
              Content API you can implement{' '}
              <strong>lazy loaded, responsive images</strong> in{' '}
              <strong>one line of code</strong>. Avoid any layout jumping, offer
              instant <strong>previews of images while they load</strong>. It’s
              like magic.
            </>
          }
        >
          <ProgressiveImagesDemo name="with DatoCMS API" />
        </TitleStripWithContent>

        <Flag
          style="good"
          seoAnalysis={seoAnalysis}
          kicker="Images Metadata"
          title={
            <>
              All the <FlagHighlight>metadata</FlagHighlight> you need
            </>
          }
          image="eye-gazing"
        >
          <p>
            Dominant colors, EXIF data, aspect ratio, filesize, copyright
            information, geolocation.{' '}
            <strong>Every possible information about your images</strong> is
            stored in DatoCMS and ready to be used in your websites.
          </p>
        </Flag>

        <Quote review={review} />
        <Flag
          style="good"
          seoAnalysis={seoAnalysis}
          kicker="All the tools you need"
          title={
            <>
              A complete set of{' '}
              <FlagHighlight>smart,&nbsp;modern&nbsp;APIs</FlagHighlight>
            </>
          }
          image="zen"
        >
          <p>
            DatoCMS does not only offer a powerful images API/CDN but a full,
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

export default ImagesApi;
