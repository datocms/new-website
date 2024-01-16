import Button from 'components/Button';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import LazyImage from 'components/LazyImage';
import Wrapper from 'components/Wrapper';
import { gqlStaticPropsWithSubscription } from 'lib/datocms';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { StructuredText, renderMetaTags } from 'react-datocms';
import seedrandom from 'seedrandom';
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
        illustration
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

function Course({ course }) {
  const seed = useMemo(() => seedrandom(course.slug)(), [course.slug]);

  const [size] = useState(seed * 1.5 + 2);
  const [x] = useState(Math.floor(seed * 30));
  const [y] = useState(Math.floor(seed * 30) + 20);

  return (
    <div className={s.course}>
      <div className={s.courseImage}>
        <div
          className={s.dot}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            height: `calc(var(--dotBaseUnit) * ${size})`,
            width: `calc(var(--dotBaseUnit) * ${size})`,
          }}
        />
        <LazyImage src={`/images/illustrations/${course.illustration}.svg`} />
      </div>
      <div className={s.courseContent}>
        <div className={s.courseTitle}>
          <Link href={`/academy/${course.slug}/${course.chapters[0].slug}`}>
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
            <Course course={course} key={course.slug} />
          ))}
      </Wrapper>
    </Layout>
  );
}
