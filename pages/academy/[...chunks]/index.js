import ActiveLink from 'components/ActiveLink';
import Head from 'components/Head';
import InterstitialTitle from 'components/InterstitialTitle';
import Layout from 'components/Layout';
import PostContent from 'components/PostContent';
import Space from 'components/Space';
import Wrapper from 'components/Wrapper';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import { isHeading } from 'datocms-structured-text-utils';
import {
  gqlStaticPaths,
  gqlStaticPropsWithSubscription,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import findIndex from 'lodash-es/findIndex';
import Link from 'next/link';
import { StructuredText, renderMetaTags } from 'react-datocms';
import filter from 'utils/filterNodes';
import slugify from 'utils/slugify';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

export const getStaticPaths = gqlStaticPaths(
  `
  {
    courses: allAcademyCourses {
      slug
      chapters { slug }
    }
  }
  `,
  'chunks',
  ({ courses }) =>
    courses.flatMap((course) =>
      course.chapters.map((chapter) => [course.slug, chapter.slug]),
    ),
);

export const getStaticProps = gqlStaticPropsWithSubscription(
  /* GraphQL */ `
    query chapterQuery($courseSlug: String!, $chapterSlug: String!) {
      chapter: academyChapter(filter: { slug: { eq: $chapterSlug } }) {
        slug
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        title
        content {
          value
          blocks {
            ... on ImageRecord {
              id
              _modelApiKey
              frameless
              image {
                format
                width
                height
                title
                alt
                responsiveImage(
                  imgixParams: { auto: format, w: 950 }
                  sizes: "(max-width: 810px) 100vw, (max-width: 1000px) 750px, (min-width: 1001px) 950px"
                ) {
                  ...imageFields
                }
                zoomableResponsiveImage: responsiveImage(
                  imgixParams: { auto: format, w: 1500, fit: max }
                ) {
                  ...imageFields
                }
                url
              }
            }
            ... on InternalVideoRecord {
              id
              _modelApiKey
              thumbTimeSeconds
              video {
                title
                width
                height
                blurUpThumb
                video {
                  playbackId: muxPlaybackId
                }
              }
            }
            ... on TableRecord {
              id
              _modelApiKey
              table
            }
          }
        }
        matchingCourses: _allReferencingAcademyCourses(
          filter: { slug: { eq: $courseSlug } }
        ) {
          slug
          name
          introduction {
            value
          }
          chapters {
            slug
            title
          }
        }
      }
    }

    ${imageFields}
    ${seoMetaTagsFields}
  `,
  {
    requiredKeys: ['chapter', 'chapter.matchingCourses[0]'],
    paramsToVars: ({ chunks }) => ({
      courseSlug: chunks[0],
      chapterSlug: chunks[1],
    }),
  },
);

function PrevNext({ course, prevChapter, nextChapter }) {
  return (
    <div className={s.prevNext}>
      <div className={s.prev}>
        {prevChapter && (
          <>
            <div className={s.prevNextTitle}>Previous chapter</div>
            <div className={s.prevNextLink}>
              <Link href={`/academy/${course.slug}/${prevChapter.slug}`}>
                <a>&larr; {prevChapter.title}</a>
              </Link>
            </div>
          </>
        )}
      </div>

      <div className={s.next}>
        {nextChapter && (
          <>
            <div className={s.prevNextTitle}>Next chapter</div>
            <div className={s.prevNextLink}>
              <Link href={`/academy/${course.slug}/${nextChapter.slug}`}>
                <a>{nextChapter.title} &rarr;</a>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Academy({ subscription, preview }) {
  const {
    data: { chapter },
  } = useQuerySubscription(subscription);

  const course = chapter.matchingCourses[0];
  const allChapters = course.chapters;

  const chapterIndex = findIndex(allChapters, (c) => c.slug === chapter.slug);

  const prevChapter =
    chapterIndex > 0 ? allChapters[chapterIndex - 1] : undefined;

  const nextChapter =
    chapterIndex < allChapters.length - 1
      ? allChapters[chapterIndex + 1]
      : undefined;

  const sections = filter(
    chapter.content.value.document,
    (node) => isHeading(node) && node.level < 5,
  ).map((heading) => {
    const slug = slugify(toPlainText(heading));
    return {
      url: `#${slug}`,
      node: heading,
    };
  });

  return (
    <Layout preview={preview}>
      <Head>{chapter && renderMetaTags(chapter.seo)}</Head>
      <Wrapper>
        <InterstitialTitle
          style="one"
          mainTitleOfPage
          kicker={
            <Link href="/academy">
              <a>DatoCMS Academy</a>
            </Link>
          }
          subtitle={<StructuredText data={course.introduction} />}
        >
          {chapter.title}
        </InterstitialTitle>
      </Wrapper>
      <Space top={1}>
        <div className={s.contentWrapper}>
          <div className={s.tocWrapper}>
            <div className={s.toc}>
              <div className={s.tocTitle}>Course chapters</div>
              <ul className={s.tocChapters}>
                {allChapters.map((nthChapter) => {
                  const isActive = nthChapter.slug === chapter.slug;

                  return (
                    <li key={nthChapter.slug} className={s.tocChapter}>
                      <ActiveLink
                        href={`/academy/${course.slug}/${nthChapter.slug}`}
                        activeClassName={s.activeTocChapter}
                      >
                        <a>{nthChapter.title}</a>
                      </ActiveLink>

                      {isActive && sections.length > 0 && (
                        <ul className={s.tocChapterSections}>
                          {sections.map((section) => {
                            console.log;
                            return (
                              <li
                                key={section.url}
                                className={s.tocChapterSection}
                              >
                                <Link href={section.url}>
                                  <a title={toPlainText(section.node)}>
                                    {toPlainText(section.node)}
                                  </a>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className={s.tocFooter}>
                <p>
                  This <strong>{course.name}</strong> course is part of{' '}
                  <Link href="/academy">
                    <a>DatoCMS Academy</a>
                  </Link>
                  , a deep dive into the concepts around headless.
                </p>
              </div>
            </div>
          </div>
          <div className={s.body} id="main-content">
            <PostContent content={chapter.content} />

            <PrevNext
              course={course}
              prevChapter={prevChapter}
              nextChapter={nextChapter}
            />
          </div>
        </div>
      </Space>
    </Layout>
  );
}
