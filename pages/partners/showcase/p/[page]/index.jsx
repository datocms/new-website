import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import Paginator from 'components/Paginator';
import Wrapper from 'components/Wrapper';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import { gqlStaticPaths, gqlStaticPropsWithSubscription } from 'lib/datocms';
import { PROJECTS_PER_PAGE } from 'lib/pages';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { range } from 'range';
import React from 'react';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      meta: _allShowcaseProjectsMeta {
        count
      }
    }
  `,
  'page',
  ({ meta }) =>
    range(
      1,
      Math.min(5, Math.ceil(meta.count / Number.parseFloat(PROJECTS_PER_PAGE))),
    ),
);

export const getStaticProps = gqlStaticPropsWithSubscription(
  `
    query($first: IntType!, $skip: IntType!) {
      meta: _allBlogPostsMeta {
        count
      }
      allShowcaseProjects(first: $first, skip: $skip, orderBy: _updatedAt_DESC) {
        id
        name
        slug
        _updatedAt
        headline {
          value
        }
        mainImage {
          url
        }
        partner {
          name
          slug
          logo {
            url
          }
        }
      }
    }
  `,
  {
    requiredKeys: ['allShowcaseProjects'],
    paramsToVars: ({ page }) => ({
      first: PROJECTS_PER_PAGE,
      skip: PROJECTS_PER_PAGE * Number.parseInt(page),
    }),
  },
);

// const styles = [s.azureLogo, s.pinkLogo, s.blueLogo, s.greenLogo, s.yellowLogo];

export default function PartnerProjects({ preview, subscription }) {
  const router = useRouter();

  const {
    data: { allShowcaseProjects, meta },
  } = useQuerySubscription(subscription);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  return (
    <Layout preview={preview}>
      <Head>
        <title>Partner Projects Showcase</title>
      </Head>
      <Wrapper>
        <Hero
          kicker="Showcase"
          title={
            <>
              Projects from Our <Highlight>Partners</Highlight>
            </>
          }
          subtitle={
            <>
              Check out some of the incredible projects our partners have
              brought to life.
            </>
          }
        />

        <div className={s.posts} style={{ display: 'grid', gap: '20px' }}>
          {allShowcaseProjects.map((project, i) => (
            <Link
              href={`/partners/${project.partner.slug}/showcase/${project.slug}`}
              key={project.slug}
            >
              <a className={s.post}>
                <div className={s.mainImage}>
                  <img
                    src={`${project.mainImage.url}?auto=format&crop=top&fit=crop&h=500&w=750`}
                    alt={project.name}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
                <div className={s.postBody}>
                  <div className={s.postTitle}>{project.name}</div>
                  <div className={s.postDescription}>
                    {truncateText(toPlainText(project.headline.value), 90)}
                  </div>
                  <div className={s.madeBy} style={{ marginTop: '10px' }}>
                    <p>Made by {project.partner.name}</p>
                    <img
                      src={project.partner.logo.url}
                      alt={project.partner.name}
                      style={{
                        maxHeight: '30px',
                        maxWidth: '100px',
                        verticalAlign: 'middle',
                      }}
                    />
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>

        <Paginator
          perPage={PROJECTS_PER_PAGE}
          currentPage={router.query ? Number.parseInt(router.query.page) : 0}
          totalEntries={meta.count}
          href={(index) =>
            index === 0 ? '/partners/showcase' : `/partners/showcase/p/${index}`
          }
        />
      </Wrapper>
    </Layout>
  );
}
