import ActiveLink from 'components/ActiveLink';
import Head from 'components/Head';
import Layout from 'components/Layout';
import PostContent from 'components/PostContent';
import Space from 'components/Space';
import VideoPlayer from 'components/VideoPlayer';
import Wrapper from 'components/Wrapper';
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
    query itemQuery($chapterSlug: String!, $itemSlug: String!) {
      item: userGuidesVideo(filter: { slug: { eq: $itemSlug } }) {
        slug
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        title
        video {
          video {
            playbackId: muxPlaybackId
            duration
          }
          width
          height
        }
        content {
          value
        }
      }
      chapterItems: allUserGuidesChapters(
        filter: { slug: { eq: $chapterSlug } }
      ) {
        slug
        title
        videos {
          slug
          title
          video {
            video {
              duration
            }
          }
        }
      }
    }

    ${seoMetaTagsFields}
  `,
  {
    requiredKeys: ['item', 'chapterItems[0]'],
    paramsToVars: ({ chunks }) => ({
      chapterSlug: chunks[0],
      itemSlug: chunks[1],
    }),
  },
);

export default function Academy({ subscription, preview}) {
  const {
    data: { item, chapterItems},
  } = useQuerySubscription(subscription);

  const convertVideoSecondsInMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
  }

  return (
    <Layout preview={preview}>
      <Head>{item && renderMetaTags(item.seo)}</Head>
      <Space top={1}>
        <Wrapper>
          <div className={s.video}>
            {item?.video?.video?.playbackId && (
              <VideoPlayer
                autoPlayAndLoop={false}
                playbackId={item.video.video.playbackId}
                width={item.video.width}
                height={item.video.height}
              />
            )}
          </div>

          <div className={s.container}>
            <div className={s.aside}>
              <div className={s.asideList}>
                <h2 className={s.asideListTitle}>{chapterItems[0].title}</h2>
                <ul>
                  {chapterItems[0].videos.map((video) => (
                    <li key={video.title}>
                      <Link href={`/user-guides/${chapterItems[0].slug}/${video.slug}`}>
                        <a className={video.slug === item.slug ? s.activeLink : ''}>
                          {video.title}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className={s.heading}>
                <h1>
                  {item.title}
                </h1>
                {item?.video?.video?.duration && (
                  <div className={s.videoDurationPill}>
                    {convertVideoSecondsInMinutes(item.video.video.duration)}
                  </div>
                )}
              </div>
              <PostContent content={item.content} />
            </div>
          </div>
        </Wrapper>
      </Space>
    </Layout>
  );
}
