import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import ImgixTransformations from 'components/ImgixTransformations';
import { withDato } from 'lib/datocms';

import styles from './style.css';

function ImagesApi() {
  return (
    <Layout>
      <Hero
        over="Images API"
        title={
          <>
            The easiest way to deliver <Highlight>fast,&nbsp;optimized&nbsp;images</Highlight>
          </>
        }
        subtitle={
          <>
            Serve lightning fast images from any digital product with a suite of tools built to save both development time and visitor bandwidth.
          </>
        }
      />

      <ImgixTransformations />

    </Layout>
  );
}

export default ImagesApi;
