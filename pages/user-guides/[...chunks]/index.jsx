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
  imageFields
} from 'lib/datocms';
import Link from 'next/link';

import { useState } from 'react';
import { Image as DatoImage, StructuredText, renderMetaTags } from 'react-datocms';
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
          image {
            responsiveImage(
              imgixParams: { auto: format, w: 200 }
            ) {
              ...imageFields
            }
            url(imgixParams: {w: 200})
          }
          video {
            video {
              duration
            }
          }
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
          image {
            responsiveImage(
              imgixParams: { auto: format, w: 200 }
            ) {
              ...imageFields
            }
            url(imgixParams: {w: 200})
          }
        }
      }
    }

    ${seoMetaTagsFields}
    ${imageFields}
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

  const convertVideoSecondsInMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
  }

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
                  {convertVideoSecondsInMinutes(item.video.video.duration)}
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
                    {currentChapter[0].videos.map((video) => (
                      <li key={video.title} className={`${s.asideListItem} ${video.slug === item.slug ? s.activeListItem : ''}`}>
                        <Link href={`/user-guides/${currentChapter[0].slug}/${video.slug}`}>
                          <a className={s.asideListItem}>
                            <figure>
                              {video?.image?.responsiveImage && (
                                <DatoImage
                                  data={video.image.responsiveImage}
                                />
                              )}
                            </figure>
                            <div>
                              <h4>
                                {video.title}
                              </h4>
                              {video?.video?.video?.duration && (
                                <div className={s.asideVideoDuration}>
                                  {convertVideoSecondsInMinutes(video.video.video.duration)}
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
                        {nextVideo?.image?.responsiveImage && (
                          <DatoImage
                            data={nextVideo.image.responsiveImage}
                          />
                        )}
                      </figure>

                      <article>
                        <p className={s.nextVideoLabel}>Next episode</p>
                        <h2>{nextVideo.title}</h2>

                        {nextVideo?.video?.video?.duration && (
                          <div className={s.pill}>
                            {convertVideoSecondsInMinutes(nextVideo.video.video.duration)}
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
                        {nextChapter.videos[0]?.image?.responsiveImage && (
                          <DatoImage
                            data={nextChapter.videos[0].image.responsiveImage}
                          />
                        )}
                      </figure>

                      <article>
                        <p className={s.nextVideoLabel}>Next chapter</p>
                        <h2>{nextChapter.title}</h2>

                        {nextChapter.videos[0]?.video?.video?.duration && (
                          <div className={s.pill}>
                            {convertVideoSecondsInMinutes(nextChapter.videos[0].video.video.duration)}
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
