import ActiveLink from 'components/ActiveLink';
import Head from 'components/Head';
import Layout from 'components/Layout';
import PostContent from 'components/PostContent';
import Space from 'components/Space';
import Wrapper from 'components/Wrapper';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import {
  gqlStaticPaths,
  gqlStaticPropsWithSubscription,
  seoMetaTagsFields,
} from 'lib/datocms';
import Link from 'next/link';
import { StructuredText, renderMetaTags } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

export const getStaticPaths = gqlStaticPaths(
  `
  {
    chapters: allUserGuidesChapters {
      slug
      videos { slug }
    }
  }
  `,
  'chunks',
  ({ chapters }) =>
    chapters.flatMap((chapter) =>
      chapter.videos.map((video) => [chapter.slug, video.slug]),
    ),
);

export const getStaticProps = gqlStaticPropsWithSubscription(
  /* GraphQL */ `
    query videoQuery($chapterSlug: String!, $videoSlug: String!) {
      video: userGuidesVideo(filter: { slug: { eq: $videoSlug } }) {
        slug
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        title
        
        content {
          value
        }
      }
      matchingVideos: allUserGuidesChapters(
        filter: { slug: { eq: $chapterSlug } }
      ) {
        slug
        videos {
          slug
          title
        }
      }
    }

    ${seoMetaTagsFields}
  `,
  {
    requiredKeys: ['video', 'matchingVideos[0]'],
    paramsToVars: ({ chunks }) => ({
      chapterSlug: chunks[0],
      videoSlug: chunks[1],
    }),
  },
);

export default function Academy({ subscription, preview }) {
  const {
    data: { video, matchingVideos},
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      <Head>{video && renderMetaTags(video.seo)}</Head>
      <Space top={2}>
        <Wrapper>
          <h1>
            {video.title}
          </h1>

          <div className={s.container}>
            <div>
              <ul>
                {matchingVideos[0].videos.map((video) => (
                  <li key={video.title}>
                    <Link href={`/user-guides/${matchingVideos[0].slug}/${video.slug}`}>
                      <a>{video.title}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <PostContent content={video.content} />
          </div>
        </Wrapper>
      </Space>
    </Layout>
  );
}
