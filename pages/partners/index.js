import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import Space from 'components/Space';
import { gqlStaticPropsWithSubscription } from 'lib/datocms';
import Link from 'next/link';
import React, { useState } from 'react';
import { useQuerySubscription } from 'react-datocms';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import s from './style.module.css';
import sortBy from 'lodash-es/sortBy';
import Head from 'components/Head';
import classNames from 'classnames';
import { Announce } from 'components/PluginToolkit';
import PartnersMap from 'components/PartnersMap';
import ReactSelect from 'react-select';

export const getStaticProps = gqlStaticPropsWithSubscription(
  /* GraphQL */ `
    {
      partnersPage {
        highlightedPartners {
          ...partner
        }
      }
      posts: allPartners(first: 100) {
        ...partner
      }
      projects: allShowcaseProjects {
        partner {
          slug
        }
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
      areasOfExpertise {
        name
      }
      technologies {
        name
      }
      locations {
        emoji
        name
        code
        continent {
          name
        }
        coordinates {
          latitude
          longitude
        }
      }
    }
  `,
  {
    requiredKeys: ['posts'],
  },
);

const styles = [s.azureLogo, s.pinkLogo, s.blueLogo, s.greenLogo, s.yellowLogo];

const toOption = (entry) => ({
  value: entry[0],
  label: entry[0],
});
const byCount = (entryA, entryB) => {
  if (entryA[1] != entryB[1]) {
    return entryB[1] - entryA[1];
  }

  return entryA[0].localeCompare(entryB[0]);
};

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

  const [technologyFilter, setTechnologyFilter] = useState(null);
  const [areaOfExpertiseFilter, setAreaOfExpertiseFilter] = useState(null);
  const [countryFilter, setCountryFilter] = useState(null);
  const [continentFilter, setContinentFilter] = useState(null);

  const filtered = ordered.filter((p) => {
    if (
      technologyFilter &&
      !p.technologies.some((t) => t.name === technologyFilter)
    ) {
      return false;
    }
    if (
      areaOfExpertiseFilter &&
      !p.areasOfExpertise.some((t) => t.name === areaOfExpertiseFilter)
    ) {
      return false;
    }
    if (
      countryFilter &&
      !p.locations.some((t) => `${t.emoji} ${t.name}` === countryFilter)
    ) {
      return false;
    }
    if (
      continentFilter &&
      !p.locations.some((t) => t.continent.name === continentFilter)
    ) {
      return false;
    }

    return true;
  });

  const allTechnologies = {};
  const allAreaOfExpertise = {};
  const allCountries = {};
  const allContinents = {};

  filtered.forEach((p) => {
    p.technologies.forEach(
      (t) => (allTechnologies[t.name] = (allTechnologies[t.name] || 0) + 1),
    );
    p.areasOfExpertise.forEach(
      (t) =>
        (allAreaOfExpertise[t.name] = (allAreaOfExpertise[t.name] || 0) + 1),
    );
    p.locations.forEach(
      (t) =>
        (allCountries[`${t.emoji} ${t.name}`] =
          (allCountries[`${t.emoji} ${t.name}`] || 0) + 1),
    );
    p.locations.forEach(
      (t) =>
        (allContinents[t.continent.name] =
          (allContinents[t.continent.name] || 0) + 1),
    );
  });

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

        <PartnersMap partners={posts} />

        <Space bottom={1}>
          <Announce href="/partner-program" center>
            <strong>Want to become a DatoCMS Partner?</strong> Learn more about
            our Partner Program and its benefits!
          </Announce>
        </Space>

        <div className={s.filterGrid}>
          <div className={s.filterLabel}>Filter by Continent</div>
          <div className={s.filterLabel}>Filter by Country</div>
          <div className={s.filterLabel}>Filter by Technology</div>
          <div className={s.filterLabel}>Filter by Area of expertise</div>

          <ReactSelect
            isClearable
            formatOptionLabel={(option) =>
              `${option.value} (${allContinents[option.value]})`
            }
            options={Object.entries(allContinents).sort(byCount).map(toOption)}
            onChange={(option) => {
              setContinentFilter(option ? option.value : null);
            }}
          />
          <ReactSelect
            isClearable
            formatOptionLabel={(option) =>
              `${option.value} (${allCountries[option.value]})`
            }
            options={Object.entries(allCountries).sort(byCount).map(toOption)}
            onChange={(option) => {
              setCountryFilter(option ? option.value : null);
            }}
          />

          <ReactSelect
            isClearable
            formatOptionLabel={(option) =>
              `${option.value} (${allTechnologies[option.value]})`
            }
            options={Object.entries(allTechnologies)
              .sort(byCount)
              .map(toOption)}
            onChange={(option) => {
              setTechnologyFilter(option ? option.value : null);
            }}
          />
          <ReactSelect
            isClearable
            formatOptionLabel={(option) =>
              `${option.value} (${allAreaOfExpertise[option.value]})`
            }
            options={Object.entries(allAreaOfExpertise)
              .sort(byCount)
              .map(toOption)}
            onChange={(option) => {
              setAreaOfExpertiseFilter(option ? option.value : null);
            }}
          />
        </div>
        <div className={s.posts}>
          {filtered.map((post, i) => (
            <Link href={`/partners/${post.slug}`} key={post.slug}>
              <a
                className={classNames(
                  s.post,
                  countBySlug[post.slug] && s.postWithShowcasedProjects,
                )}
              >
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
                </div>
                {countBySlug[post.slug] && (
                  <div className={s.showcasedProjects}>
                    {countBySlug[post.slug]} showcased project
                    {countBySlug[post.slug] > 1 && <>s</>}
                  </div>
                )}
              </a>
            </Link>
          ))}
        </div>
      </Wrapper>
    </Layout>
  );
}
