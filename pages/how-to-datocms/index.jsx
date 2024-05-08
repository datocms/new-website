import Button from 'components/Button';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import LogosBar from 'components/LogosBar';
import Space from 'components/Space';
// import useSWR from 'swr';
import { gqlStaticProps, imageFields, seoMetaTagsFields } from 'lib/datocms';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import Polestar from 'public/images/logos/polestar.svg';
import Vercel from 'public/images/logos/vercel.svg';
import Verizon from 'public/images/logos/verizon.svg';
import { useEffect, useState } from 'react';
import { Image as DatoImage, renderMetaTags } from 'react-datocms';

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

// export const getStaticProps = gqlStaticProps(
//   /* GraphQL */
//   `
//     {
//       page: howToDatoCmsPage {
//         seo: _seoMetaTags {
//           ...seoMetaTagsFields
//         }
//       }
//     }

//     ${imageFields}
//     ${seoMetaTagsFields}
//   `,
// );

export default function HowToDatoCms({ page }) {
  return (
    <Layout>
      <Head>{renderMetaTags(page.seo)}</Head>
      <Hero
        kicker="How To DatoCMS"
        title={
          <>
            Everything you need to <Highlight>master</Highlight> DatoCMS
          </>
        }
        subtitle="How To DatoCMS is your central hub to find everything you need to level up your DatoCMS and Headless CMS knowledge"
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
        image="video-player"
        title={
          <>
            DatoCMS <FlagHighlight>User&nbsp;Guides</FlagHighlight>
          </>
        }
      >
        <p>
          Casual and non-technical walkthroughs of DatoCMS focusing on content
          creation and the UI, made for content creators and editors.
        </p>
        <Button as="a" p="small" href={'/user-guides/'}>
          Launch User Guides
        </Button>
      </Flag>

      <Flag
        style="good"
        image="zen"
        title={
          <>
            DatoCMS <FlagHighlight>Academy</FlagHighlight>
          </>
        }
      >
        <p>
          Deep dive into the concepts around Headless CMS, Content APIs, and
          frontend frameworks.
        </p>
        <Button as="a" p="small" href={'/academy/'}>
          Launch Academy
        </Button>
      </Flag>

      <Flag
        style="good"
        image="muscles"
        title={
          <>
            Developer <FlagHighlight>Docs</FlagHighlight>
          </>
        }
      >
        <p>
          All the technical documentation on our REST and GraphQL APIs for
          managing your projects.
        </p>
        <Button as="a" p="small" href={'/docs/'}>
          Launch Docs
        </Button>
      </Flag>
    </Layout>
  );
}
