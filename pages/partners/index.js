import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import { gqlStaticPropsWithSubscription } from 'lib/datocms';
import Link from 'next/link';
import React from 'react';
import { useQuerySubscription } from 'react-datocms';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import s from './style.module.css';
import sortBy from 'lodash-es/sortBy';
import Head from 'components/Head';
import classNames from 'classnames';

export const getStaticProps = gqlStaticPropsWithSubscription(
  `
    {
      partnersPage {
        highlightedPartners {
          ...partner
        }
      }
      posts: allPartners {
        ...partner
      }
      projects: allShowcaseProjects {
        partner { slug }
      }
    }

    fragment partner on PartnerRecord {
      name
      slug
      logo {
        url
      }
      shortDescription {
        value
      }
      locations {
        emoji
      }
    }
  `,
  {
    requiredKeys: ['posts'],
  },
);

const styles = [s.azureLogo, s.pinkLogo, s.blueLogo, s.greenLogo, s.yellowLogo];

export default function Partners({ subscription, preview }) {
  const {
    data: { posts, partnersPage, projects },
  } = useQuerySubscription(subscription);

  const countBySlug = projects.reduce((acc, project) => ({
    ...acc,
    [project.partner.slug]: acc[project.partner.slug]
      ? acc[project.partner.slug] + 1
      : 1,
  }));

  const highlightedSlugs = partnersPage.highlightedPartners.map((p) => p.slug);

  const ordered = [
    ...partnersPage.highlightedPartners,
    ...sortBy(
      posts.filter((p) => !highlightedSlugs.includes(p.slug)),
      [(x) => -(countBySlug[x.slug] || 0), 'name'],
    ),
  ];

  return (
    <Layout preview={preview}>
      <Head>
        <title>DatoCMS Solution Partners</title>
      </Head>
      <Wrapper>
        <Hero
          kicker="Solution Partners"
          title={
            <>
              Find the perfect Partner to meet{' '}
              <Highlight>your digital needs</Highlight>
            </>
          }
          subtitle={
            <>
              Our most successful customers work with a Solution Partner to
              accomplish their goals and ship their digital products faster.
            </>
          }
        />

        <div className={s.posts}>
          {ordered.map((post, i) => (
            <Link href={`/partners/${post.slug}`} key={post.slug}>
              <a className={s.post}>
                <div
                  className={classNames(s.postLogo, styles[i % styles.length])}
                >
                  <img src={post.logo.url} />
                </div>
                <div className={s.postBody}>
                  <div className={s.postTitle}>
                    {post.name}{' '}
                    {post.locations.map((l) => (
                      <span key={l.emoji}>{l.emoji}</span>
                    ))}
                  </div>
                  <div className={s.postDescription}>
                    {toPlainText(post.shortDescription)}
                  </div>
                  <div className={s.postDescription}></div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </Wrapper>
    </Layout>
  );
}
