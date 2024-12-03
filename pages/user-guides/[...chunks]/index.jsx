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
import Image from 'next/image';
import Link from 'next/link';
import formatVideoDuration from 'utils/formatVideoDuration';

import { useState } from 'react';
import { renderMetaTags } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

import ChevronDown from 'public/icons/regular/chevron-down.svg';
import ChevronLeft from 'public/icons/regular/chevron-left.svg';

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
      item: userGuidesEpisode(filter: { slug: { eq: $itemSlug } }) {
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
          blocks {
            __typename
            ...on InternalVideoRecord {
              id
              video {
                video {
                  playbackId: muxPlaybackId
                }
                width
                height
              }
              thumbTimeSeconds
            }
          }
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
              width
              height
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
              duration
              thumbnailUrl
              blurUpThumb
              width
              height
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

export default function Guide({ subscription, preview }) {
  const {
    data: { item, currentChapter, otherChapters, allChapters },
  } = useQuerySubscription(subscription);

  const currentChapterIndex = allChapters.findIndex(
    (chapter) => chapter.slug === currentChapter[0].slug,
  );
  const nextChapter = allChapters[currentChapterIndex + 1];
  const getChapterIndexBySlug = (slug) =>
    allChapters.findIndex((chapter) => chapter.slug === slug) + 1;

  const currentVideoIndex = currentChapter[0].videos.findIndex(
    (video) => video.slug === item.slug,
  );
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
            <VideoPlayer
              autoPlayAndLoop={false}
              playbackId={item.video.video.playbackId}
              width={item.video.width}
              height={item.video.height}
            />
          </div>

          <div className={s.container}>
            <div className={s.headingWrapper}>
              <Link href="/user-guides">
                <a className={s.back}>
                  <ChevronLeft />
                  <span>Back to All Videos</span>
                </a>
              </Link>

              <div className={s.heading}>
                <h1>{item.title}</h1>
                <div className={`${s.pill} ${s.isDark}`}>
                  {formatVideoDuration(item.video.video.duration)}
                </div>
              </div>
            </div>

            <div>
              <PostContent
                content={item.content}
                renderBlock={(block) => {
                  switch (block.__typename) {
                    case 'InternalVideoRecord': {
                      return (
                        <div className={s.contentVideo}>
                          <VideoPlayer
                            autoPlayAndLoop={false}
                            playbackId={block.video.video.playbackId}
                            width={block.video.width}
                            height={block.video.height}
                            blurUpThumb={block.video.video.blurUpThumb}
                            thumbnailTime={block.thumbTimeSeconds}
                          />
                        </div>
                      );
                    }
                    default: {
                      return null;
                    }
                  }
                }}
              />
              {nextVideo ? (
                <div className={s.nextVideo}>
                  <Link
                    href={`/user-guides/${currentChapter[0].slug}/${nextVideo.slug}`}
                  >
                    <a>
                      <figure>
                        <Image
                          src={`${nextVideo.video.video.thumbnailUrl}${
                            nextVideo.thumbTimeSeconds
                              ? `?time=${nextVideo.thumbTimeSeconds}`
                              : null
                          }`}
                          blurDataURL={nextVideo.video.video.blurUpThumb}
                          width={nextVideo.video.video.width / 2}
                          height={nextVideo.video.video.height / 2}
                          alt={nextVideo.title}
                        />
                      </figure>

                      <article>
                        <p className={s.nextVideoLabel}>Next episode</p>
                        <h2>{nextVideo.title}</h2>
                        <div className={s.pill}>
                          {formatVideoDuration(nextVideo.video.video.duration)}
                        </div>
                      </article>
                    </a>
                  </Link>
                </div>
              ) : nextChapter ? (
                <div className={s.nextVideo}>
                  <Link
                    href={`/user-guides/${nextChapter.slug}/${nextChapter.videos[0].slug}`}
                  >
                    <a>
                      <figure>
                        <Image
                          src={`${
                            nextChapter.videos[0].video.video.thumbnailUrl
                          }${
                            nextChapter.videos[0].thumbTimeSeconds
                              ? `?time=${nextChapter.videos[0].thumbTimeSeconds}`
                              : null
                          }`}
                          blurDataURL={
                            nextChapter.videos[0].video.video.blurUpThumb
                          }
                          width={nextChapter.videos[0].video.video.width / 2}
                          height={nextChapter.videos[0].video.video.height / 2}
                          alt={nextChapter.videos[0].title}
                        />
                      </figure>

                      <article>
                        <p className={s.nextVideoLabel}>Next chapter</p>
                        <h2>{nextChapter.title}</h2>
                        {nextChapter.videos[0]?.video.video.duration && (
                          <div className={s.pill}>
                            {formatVideoDuration(
                              nextChapter.videos[0].video.video.duration,
                            )}
                          </div>
                        )}
                      </article>
                    </a>
                  </Link>
                </div>
              ) : null}
            </div>

            <div className={s.asideWrapper}>
              <aside className={s.aside}>
                <div className={s.asideCurrentChapter}>
                  <div className={s.asideHeadingWrapper}>
                    <div className={s.asideHeadingIntro}>
                      <p className={s.asideChapterLabel}>
                        Chapter #{currentChapterIndex + 1}
                      </p>
                      <div className={`${s.pill} ${s.isLight}`}>
                        {currentChapter[0].videos.length} videos
                      </div>
                    </div>
                    <h2 className={s.asideListTitle}>
                      {currentChapter[0].title}
                    </h2>
                  </div>
                  <ul
                    className={`${s.asideList} ${
                      isOpen ? s.isOpen : s.isClosed
                    }`}
                  >
                    {currentChapter[0].videos
                      .filter((episode) => episode?.video)
                      .map((episode) => (
                        <li
                          key={episode.title}
                          className={`${s.asideListItem} ${
                            episode.slug === item.slug ? s.activeListItem : ''
                          }`}
                        >
                          <Link
                            href={`/user-guides/${currentChapter[0].slug}/${episode.slug}`}
                          >
                            <a className={s.asideListItem}>
                              <figure>
                                <Image
                                  src={`${episode.video.video.thumbnailUrl}${
                                    episode.thumbTimeSeconds
                                      ? `?time=${episode.thumbTimeSeconds}`
                                      : null
                                  }`}
                                  blurDataURL={episode.video.video.blurUpThumb}
                                  width={episode.video.video.width / 4}
                                  height={episode.video.video.height / 4}
                                  alt={episode.title}
                                />
                              </figure>
                              <div>
                                <h4>{episode.title}</h4>
                                <div className={s.asideVideoDuration}>
                                  {formatVideoDuration(
                                    episode.video.video.duration,
                                  )}
                                </div>
                              </div>
                            </a>
                          </Link>
                        </li>
                      ))}
                  </ul>
                  <div
                    className={s.mobileAccordionCta}
                    onClick={toggleAccordion}
                  >
                    <div
                      className={`${s.mobileAccordionCtaIcon} ${
                        isOpen ? s.isRotated : ''
                      }`}
                    >
                      <ChevronDown />
                    </div>
                  </div>
                </div>
                <div className={s.otherChaptersWrapper}>
                  <h3 className={s.otherChaptersTitle}>Other chapters</h3>
                  <div className={s.otherChapters}>
                    {otherChapters
                      .filter((chapter) => chapter.videos.length)
                      .map((chapter) => (
                        <Link
                          key={chapter.slug}
                          href={`/user-guides/${chapter.slug}/${chapter.videos[0].slug}`}
                          passHref
                        >
                          <a className={s.otherChaptersItem}>
                            <div className={s.otherChaptersIntro}>
                              <p className={s.otherChaptersLabel}>
                                Chapter #{getChapterIndexBySlug(chapter.slug)}
                              </p>
                              <div className={s.pill}>
                                {chapter.videos.length} videos
                              </div>
                            </div>
                            <h2 className={s.otherChaptersHeading}>
                              {chapter.title}
                            </h2>
                          </a>
                        </Link>
                      ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </Wrapper>
      </Space>
    </Layout>
  );
}
