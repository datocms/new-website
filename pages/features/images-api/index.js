import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import ImgixTransformations from 'components/ImgixTransformations';
import ProgressiveImagesDemo from 'components/ProgressiveImagesDemo';
import TitleStripWithContent from 'components/TitleStripWithContent';
import Quote from 'components/Quote';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Ill4 from 'public/images/illustrations/dato-svg-2a-01.svg';

import styles from './style.css';

function ImagesApi() {
  return (
    <Layout>
      <Hero
        over="Images API"
        title={
          <>
            The easiest way to deliver{' '}
            <Highlight>fast,&nbsp;optimized&nbsp;images</Highlight>
          </>
        }
        subtitle={
          <>
            Serve lightning fast images from any digital product with a suite of
            tools built to save both development time and visitor bandwidth.
          </>
        }
      />

      <TitleStripWithContent
        title={<>Endless image transformations at your disposal</>}
        subtitle={
          <>
            DatoCMS offers best-in-class image processing and image CDN thanks
            to the seamless partnership with Imgix. Optimize, resize, crop,
            rotate and watermark images on-the-fly simply adding custom
            parameters to the URL of your image.
          </>
        }
      >
        <ImgixTransformations />
      </TitleStripWithContent>

      <Flag
        style="good"
        title={
          <>
            Automatically serve{' '}
            <FlagHighlight>the&nbsp;best&nbsp;output&nbsp;format</FlagHighlight>
          </>
        }
        image={Ill4}
      >
        <p>
          Thanks to automatic Content Negotiation, you are able to serve WebP
          (and other modern formats as we add them) to browsers that support
          them without any additional work, reducing the average file size by
          50%.
        </p>
      </Flag>

      <Quote
        quote={
          <>
            With DatoCMS we made the impossibile: we launched a successful
            omnichannel campaign in <Highlight>less than a month</Highlight>.
          </>
        }
        author="Tizio Caio, Chief Marketing Officer @BigshotFirm"
      />

      <TitleStripWithContent
        title={<>State of the art for responsive and progressive images</>}
        subtitle={
          <>
            Serving optimized images is incredibly hard, but using our GraphQL
            Content API you can implement lazy loaded, responsive images in one
            line of code. Avoid any layout jumping, offer instant previews of
            images while they load. It’s like magic.
          </>
        }
      >
        <ProgressiveImagesDemo />
      </TitleStripWithContent>

      <Quote
        quote={
          <>
            With DatoCMS we made the impossibile: we launched a successful
            omnichannel campaign in <Highlight>less than a month</Highlight>.
          </>
        }
        author="Tizio Caio, Chief Marketing Officer @BigshotFirm"
      />

      <Flag
        style="good"
        title={
          <>
            All the <FlagHighlight>metadata</FlagHighlight> you need
          </>
        }
        image={Ill4}
      >
        <p>
          Dominant colors, EXIF data, aspect ratio, filesize, copyright
          information, geolocation. Every possible information on your images is
          stored in DatoCMS and ready to be used in your websites.
        </p>
      </Flag>
    </Layout>
  );
}

export default ImagesApi;
