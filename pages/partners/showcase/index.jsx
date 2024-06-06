import classNames from 'classnames';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import { gqlStaticPropsWithSubscription } from 'lib/datocms';
import Link from 'next/link';
import React from 'react';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

export const getStaticProps = gqlStaticPropsWithSubscription(
`
  {
    allShowcaseProjects(first: 100, orderBy: _updatedAt_DESC) {
      id
      name
      slug
      _updatedAt
      headline {
        value
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
  },
);

const styles = [s.azureLogo, s.pinkLogo, s.blueLogo, s.greenLogo, s.yellowLogo];

export default function PartnerProjects({ subscription, preview }) {
  const {
    data: { allShowcaseProjects },
  } = useQuerySubscription(subscription);

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
              Check out some of the incredible projects our partners have brought to life.
            </>
          }
        />

        <div className={s.posts}>
          {allShowcaseProjects.map((project, i) => (
            <Link href={`/partners/${project.partner.slug}/showcase/${project.slug}`} key={project.slug}>
              <a className={s.post}>
                <div className={classNames(s.postLogo, styles[i % styles.length])}>
                  <img src={project.partner.logo.url} alt={project.partner.name} />
                </div>
                <div className={s.postBody}>
                  <div className={s.postTitle}>{project.name} by {project.partner.name}</div>
                  <div className={s.postDescription}>
                    {toPlainText(project.headline)}
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </Wrapper>
    </Layout>
  );
}
