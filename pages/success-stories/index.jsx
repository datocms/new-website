import Button from 'components/Button';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import LogosBar from 'components/LogosBar';
import Space from 'components/Space';
import { gqlStaticProps, seoMetaTagsFields } from 'lib/datocms';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import Polestar from 'public/images/logos/polestar.svg';
import Vercel from 'public/images/logos/vercel.svg';
import Verizon from 'public/images/logos/verizon.svg';
import { useEffect, useState } from 'react';
import { renderMetaTags } from 'react-datocms';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

export const getStaticProps = gqlStaticProps(
  `
    {
      page: successStoriesIndex {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
    }

    ${seoMetaTagsFields}
  `,
);

export default function HowToDatoCms({ page }) {
  return (
    <Layout>
      <Head>{renderMetaTags(page.seo)}</Head>
      <Hero
        kicker="Success Stories"
        title={
          <>
            DatoCMS <Highlight>in the wild</Highlight>
          </>
        }
        subtitle="A compilation of how some of our partners and customers use DatoCMS in production"
      />

      <Space top={2} bottom={2}>
        <LogosBar
          title="We power experiences for over half a billion users"
          clients={[
            <DeutscheTelekom key="DeutscheTelekom" />,
            <Hashicorp key="Hashicorp" />,
            <Verizon key="Verizon" />,
            <Polestar key="Polestar" />,
            <Vercel key="Vercel" />,
          ]}
        />
      </Space>

      <Flag
        style="good"
        image="castle"
        title={
          <>
            Enterprise <FlagHighlight>Case&nbsp;Studies</FlagHighlight>
          </>
        }
      >
        <p>
          An insight into how the most ambitious brands in the world use DatoCMS to manage their content
        </p>
        <Button as="a" p="small" href={'/customers/'}>
          Explore case studies
        </Button>
      </Flag>

      <Flag
        style="good"
        image="space"
        title={
          <>
            <FlagHighlight>Partner</FlagHighlight> Projects
          </>
        }
      >
        <p>
          Our most successful customers work with our agency partners to bring some incredible projects to life
        </p>
        <Button as="a" p="small" href={'/partners/showcase/'}>
          Explore partner showcase
        </Button>
      </Flag>

      <Flag
        style="good"
        image="people"
        title={
          <>
            Wall of <FlagHighlight>Love</FlagHighlight>
          </>
        }
      >
        <p>
          So much 🫶🏽 making us blush! See what our users and partners have to say about working with us
        </p>
        <Button as="a" p="small" href={'/wall/'}>
          Read our testimonials
        </Button>
      </Flag>
    </Layout>
  );
}
