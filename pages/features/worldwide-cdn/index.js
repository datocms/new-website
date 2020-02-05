import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import { withDato } from 'lib/datocms';
import CdnMap from 'components/CdnMap';
import styles from './style.css';

function Developers() {
  return (
    <Layout>
      <Hero
        over="DatoCMS for Developers"
        title={
          <>
            Content, images and videos, <Highlight>all on the edge</Highlight>
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

    </Layout>
  );
}

export default withDato(Developers);
