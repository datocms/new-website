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
import ImgixTransformations from 'components/ImgixTransformations';
import ProgressiveImagesDemo from 'components/ProgressiveImagesDemo';
import TitleStripWithContent from 'components/TitleStripWithContent';
import Quote from 'components/Quote';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';

export const getStaticProps = gqlStaticProps(
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
  const { keyword } = feature.yoastAnalysis;

  return (
    <Layout preview={preview}>
      <Head seo={feature.seo} slug={feature.slug} />
      <Hero
        kicker={feature.seoH1}
        keyword={keyword}
        title={
          <>
            The easiest way to deliver{' '}
            <Highlight>fast, optimized&nbsp;images</Highlight>
          </>
        }
        subtitle={
          <>
            Serve <strong>lightning-fast images</strong> for any digital product
            with a suite of tools and API built to save both development time
            and visitor bandwidth.
          </>
        }
      />
      <div id="main-content">
        <TitleStripWithContent
          kicker={`Best API for images processing`}
          keyword={keyword}
          title={<>Endless image transformations at your service</>}
          subtitle={
            <>
              DatoCMS offers best-in-class API for{' '}
              <strong>images processing</strong> and <strong>image CDN</strong>{' '}
              thanks to the seamless partnership with Imgix.{' '}
              <strong>Optimize, resize, crop, rotate</strong> and watermark
              images on-the-fly simply adding custom parameters to the URL of
              your image.
            </>
          }
        >
          <ImgixTransformations />
        </TitleStripWithContent>

        <Flag
          style="good"
          keyword={keyword}
          kicker={`Optimized images API`}
          title={
            <>
              Automatically serve{' '}
              <FlagHighlight>
                the&nbsp;best&nbsp;output&nbsp;format
              </FlagHighlight>
            </>
          }
          image="key"
        >
          <p>
            Thanks to{' '}
            <strong>DatoCMS API&apos;s automatic Content Negotiation</strong>,
            you are able to serve WebP and other modern images formats to
            browsers that support them without any additional work,{' '}
            <strong>reducing the average file size by 50%</strong>.
          </p>
        </Flag>

        <TitleStripWithContent
          kicker={`Images preview API`}
          keyword={keyword}
          title={<>State of the art for responsive and progressive images</>}
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
          <ProgressiveImagesDemo name={`with Dato images API`} />
        </TitleStripWithContent>

        <Flag
          style="good"
          keyword={keyword}
          kicker={`Images API Metadata`}
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
            stored in DatoCMS and ready to be used in your websites through our
            API.
          </p>
        </Flag>

        <Quote review={review} />
      </div>
    </Layout>
  );
}

export default ImagesApi;
