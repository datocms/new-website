import Head from 'components/Head';
import Layout from 'components/Layout';
import PostContent from 'components/PostContent';
import Space from 'components/Space';
import VideoPlayer from 'components/VideoPlayer';
import Wrapper from 'components/Wrapper';
import PrettyDuration from 'components/PrettyDuration';
import {
  gqlStaticPaths,
  gqlStaticPropsWithSubscription,
  seoMetaTagsFields,
} from 'lib/datocms';
import Link from 'next/link';
import Image from 'next/image'

import { useState } from 'react';
import { StructuredText, renderMetaTags } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

import ChevronDown from 'public/icons/regular/chevron-down.svg';

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
      currentChapter: allUserGuidesChapters(
        filter: { slug: { eq: $chapterSlug } }
      ) {
        title
        slug
        videos {
          title
          slug
          video {
            video {
              duration
              thumbnailUrl
              blurUpThumb
            }
          }
          thumbTimeSeconds
        }
      }
      otherChapters: allUserGuidesChapters(
        filter: { slug: { neq: $chapterSlug } }
      ) {
        slug
        title
        videos {
          slug
        }
      }
      allChapters: allUserGuidesChapters {
        slug
        title
        videos {
          slug
          video {
            video {
              thumbnailUrl
              blurUpThumb
            }
          }
          thumbTimeSeconds
        }
      }
    }

    ${seoMetaTagsFields}
  `,
  {
    requiredKeys: ['item', 'currentChapter[0]'],
    paramsToVars: ({ chunks }) => ({
      chapterSlug: chunks[0],
      itemSlug: chunks[1],
    }),
  },
);

export default function Guide({ subscription, preview}) {
  const {
    data: { item, currentChapter, otherChapters, allChapters},
  } = useQuerySubscription(subscription);

  const currentChapterIndex = allChapters.findIndex(chapter => chapter.slug === currentChapter[0].slug);
  const nextChapter = allChapters[currentChapterIndex + 1];
  const getChapterIndexBySlug = (slug) => allChapters.findIndex(chapter => chapter.slug === slug) + 1;

  const currentVideoIndex = currentChapter[0].videos.findIndex(video => video.slug === item.slug);
  const nextVideo = currentChapter[0].videos[currentVideoIndex + 1];

  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

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
            <div className={s.heading}>
              <h1>
                {item.title}
              </h1>
              {item?.video?.video?.duration && (
                <div className={`${s.pill} ${s.isDark}`}>
                  {PrettyDuration(item.video.video.duration)}
                </div>
              )}
            </div>

            <div className={s.asideWrapper}>
              <aside className={s.aside}>
                <div className={s.asideCurrentChapter}>
                  <div className={s.asideHeadingWrapper}>
                    <p className={s.asideChapterLabel}>
                      Chapter #{currentChapterIndex + 1}
                    </p>
                    <div className={s.asideHeading}>
                      <h2 className={s.asideListTitle}>{currentChapter[0].title}</h2>
                      <div className={`${s.pill} ${s.isLight}`}>
                        {currentChapter[0].videos.length} videos
                      </div>
                    </div>
                  </div>
                  <ul className={`${s.asideList} ${isOpen ? s.isOpen : s.isClosed}`}>
                    {currentChapter[0].videos.map((episode) => (
                      <li key={episode.title} className={`${s.asideListItem} ${episode.slug === item.slug ? s.activeListItem : ''}`}>
                        <Link href={`/user-guides/${currentChapter[0].slug}/${episode.slug}`}>
                          <a className={s.asideListItem}>
                            <figure>
                              {episode?.video?.video?.thumbnailUrl && (
                                <Image
                                  src={`${episode.video.video.thumbnailUrl}${episode.thumbTimeSeconds ? `?time=${episode.thumbTimeSeconds}` : null}`}
                                  blurDataURL={episode.video.video.blurUpThumb}
                                  width={1024}
                                  height={593}
                                  alt={episode.title}
                                />
                              )}
                            </figure>
                            <div>
                              <h4>
                                {episode.title}
                              </h4>
                              {episode?.video?.video?.duration && (
                                <div className={s.asideVideoDuration}>
                                  {PrettyDuration(episode.video.video.duration)}
                                </div>
                              )}
                            </div>
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className={s.mobileAccordionCta} onClick={toggleAccordion}>
                    <div className={`${s.mobileAccordionCtaIcon} ${isOpen ? s.isRotated : ''}`}>
                      <ChevronDown />
                    </div>
                  </div>
                </div>
                <div className={s.otherChaptersWrapper}>
                  <h3 className={s.otherChaptersTitle}>Other chapters</h3>
                  <div className={s.otherChapters}>
                    {otherChapters.filter((chapter) => chapter.videos.length).map((chapter) => (
                      <Link key={chapter.slug} href={`/user-guides/${chapter.slug}/${chapter.videos[0]?.slug}`} passHref>
                        <a className={s.otherChaptersItem}>
                          <p className={s.otherChaptersLabel}>
                            Chapter #{getChapterIndexBySlug(chapter.slug)}
                          </p>
                          <div className={s.otherChaptersHeading}>
                            <h2>
                              {chapter.title}
                            </h2>
                            <div className={s.pill}>
                              {chapter?.videos?.length} videos
                            </div>
                          </div>
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>

            <div>
              <PostContent content={item.content} />
              {nextVideo ? (
                <div className={s.nextVideo}>
                  <Link href={`/user-guides/${currentChapter[0].slug}/${nextVideo.slug}`}>
                    <a>
                      <figure>
                        {nextVideo?.video?.video?.thumbnailUrl && (
                          <Image
                            src={`${nextVideo.video.video.thumbnailUrl}${nextVideo.thumbTimeSeconds ? `?time=${nextVideo.thumbTimeSeconds}` : null}`}
                            blurDataURL={nextVideo.video.video.blurUpThumb}
                            width={1024}
                            height={593}
                            alt={episode.title}
                          />
                        )}
                      </figure>

                      <article>
                        <p className={s.nextVideoLabel}>Next episode</p>
                        <h2>{nextVideo.title}</h2>

                        {nextVideo?.video?.video?.duration && (
                          <div className={s.pill}>
                            {PrettyDuration(nextVideo.video.video.duration)}
                          </div>
                        )}
                      </article>
                    </a>
                  </Link>
                </div>
              ) : nextChapter ? (
                <div className={s.nextVideo}>
                  <Link href={`/user-guides/${nextChapter.slug}/${nextChapter.videos[0]?.slug}`}>
                    <a>
                      <figure>
                        {nextChapter.videos[0]?.video?.video?.thumbnailUrl && (
                          <Image
                            src={`${nextChapter.videos[0].video.video.thumbnailUrl}${nextChapter.videos[0].thumbTimeSeconds ? `?time=${nextChapter.videos[0].thumbTimeSeconds}` : null}`}
                            blurDataURL={nextChapter.videos[0].video.video.blurUpThumb}
                            width={1024}
                            height={593}
                            alt={episode.title}
                          />
                        )}
                      </figure>

                      <article>
                        <p className={s.nextVideoLabel}>Next chapter</p>
                        <h2>{nextChapter.title}</h2>

                        {nextChapter.videos[0]?.video?.video?.duration && (
                          <div className={s.pill}>
                            {PrettyDuration(nextChapter.videos[0].video.video.duration)}
                          </div>
                        )}
                      </article>
                    </a>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </Wrapper>
      </Space>
    </Layout>
  );
}
