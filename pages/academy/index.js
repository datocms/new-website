import Button from 'components/Button';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import { gqlStaticPropsWithSubscription } from 'lib/datocms';
import Link from 'next/link';
import { StructuredText, renderMetaTags } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

export const getStaticProps = gqlStaticPropsWithSubscription(
  /* GraphQL */ `
    {
      page: academyPage {
        seo: _seoMetaTags {
          tag
          attributes
          content
        }
      }
      courses: allAcademyCourses(orderBy: position_ASC) {
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
  `,
  {
    requiredKeys: ['page', 'courses'],
  },
);

function intersperse(arr, sep, endSep = sep) {
  if (arr.length === 0) {
    return [];
  }

  return arr.slice(1).reduce(
    (xs, x, i) => {
      return xs.concat([i === arr.length - 2 ? endSep : sep, x]);
    },
    [arr[0]],
  );
}

export default function Academy({ subscription, preview }) {
  const {
    data: { courses, page },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      <Head>{page && renderMetaTags(page.seo)}</Head>
      <Wrapper>
        <Hero
          title={
            <>
              DatoCMS <Highlight>Academy</Highlight>
            </>
          }
          subtitle="Browse the DatoCMS Academy for a deep dive into the concepts around Headless CMS. Content APIs, and frontend frameworks, to get up to speed with headless content management"
        />
        {courses
          .filter((course) => course.chapters.length > 0)
          .map((course) => (
            <div key={course.slug} className={s.course}>
              <div className={s.courseImage} />
              <div className={s.courseContent}>
                <div className={s.courseTitle}>
                  <Link
                    href={`/academy/${course.slug}/${course.chapters[0].slug}`}
                  >
                    {course.name}
                  </Link>
                </div>
                <div className={s.courseIntro}>
                  <StructuredText data={course.introduction} />
                  <Button
                    as="a"
                    p="small"
                    href={`/academy/${course.slug}/${course.chapters[0].slug}`}
                  >
                    Get started
                  </Button>
                </div>
                <div className={s.courseChapters}>
                  Chapters:{' '}
                  {intersperse(
                    course.chapters.map((chapter) => (
                      <Link
                        key={chapter.slug}
                        href={`/academy/${course.slug}/${chapter.slug}`}
                      >
                        <a>{chapter.title}</a>
                      </Link>
                    )),
                    ', ',
                  )}
                </div>
              </div>
            </div>
          ))}
      </Wrapper>
    </Layout>
  );
}
