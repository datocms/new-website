import Button from 'components/Button';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Layout from 'components/Layout';
import LazyImage from 'components/LazyImage';
import Space from 'components/Space';
import Wrapper from 'components/Wrapper';
import { gqlStaticPropsWithSubscription, seoMetaTagsFields, imageFields } from 'lib/datocms';
import Link from 'next/link';
import { StructuredText, renderMetaTags } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

export const getStaticProps = gqlStaticPropsWithSubscription(
  /* GraphQL */ `
    {
      page: userGuidesHome {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
      chapters: allUserGuidesChapters {
        title
        slug
        introduction {
          blocks
        }
        videos {
          title
          slug
          image {
            responsiveImage {
              ...imageFields
            }
          }
        }
      }
    }

    ${seoMetaTagsFields}
    ${imageFields}
  `,
  {
    requiredKeys: ['page', 'chapters'],
  },
);

function Chapter({ chapter }) {
  return (
    <div className={s.chapter}>
      <h2>
        {chapter.title}
      </h2>

      <section className={s.chapterVideosWrapper}>
        {chapter.videos.map((video) => (
          <div key={video.slug} className={s.chapterItem}>
            <div className={s.itemVideo}></div>
            <Link href={`/user-guides/${chapter.slug}/${video.slug}`}>
              {video.title}
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}

export default function Academy({ subscription, preview }) {
  const {
    data: { chapters, page },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      <Head>{page && renderMetaTags(page.seo)}</Head>
      <Wrapper>
        <Hero
          title={
            <>
              Editor Guides
            </>
          }
          subtitle="Editors and content creators, this one’s for you. Join along for a casual and non-technical walkthrough of DatoCMS focusing on content creation and the UI."
        />
        <Space top={2} bottom={2}>
          {chapters
            .filter((chapter) => chapter.videos.length > 0)
            .map((chapter) => (
              <Chapter chapter={chapter} key={chapter.slug} />
            ))}
        </Space>
      </Wrapper>
    </Layout>
  );
}
