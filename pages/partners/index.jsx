import classNames from 'classnames';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import PartnersMap from 'components/PartnersMap';
import { Announce } from 'components/PluginToolkit';
import Space from 'components/Space';
import Wrapper from 'components/Wrapper';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import { gqlStaticPropsWithSubscription } from 'lib/datocms';
import { uniq } from 'lodash-es';
import sortBy from 'lodash-es/sortBy';
import Link from 'next/link';
import React, { useState } from 'react';
import ReactSelect from 'react-select';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

export const getStaticProps = gqlStaticPropsWithSubscription(
  /* GraphQL */ `
    {
      partnersPage {
        highlightedPartners {
          ...partner
        }
      }
      posts1: allPartners(first: 100) {
        ...partner
      }
      posts2: allPartners(skip: 100, first: 100) {
        ...partner
      }
      posts3: allPartners(skip: 200, first: 100) {
        ...partner
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
      }
      _allReferencingShowcaseProjectsMeta {
        count
      }
    }
  `,
  {
    requiredKeys: ['posts1'],
  },
);

const styles = [s.azureLogo, s.pinkLogo, s.blueLogo, s.greenLogo, s.yellowLogo];

const toOption = (entry) => ({
  value: entry[0],
  label: entry[0],
});
const byCount = (entryA, entryB) => {
  if (entryA[1] !== entryB[1]) {
    return entryB[1] - entryA[1];
  }

  return entryA[0].localeCompare(entryB[0]);
};

function calculateCounters(agencies, continent, country) {
  const allTechnologies = {};
  const allAreaOfExpertise = {};
  const allCountries = {};
  const allContinents = {};

  agencies.forEach((p) => {
    p.technologies.forEach(
      (t) => (allTechnologies[t.name] = (allTechnologies[t.name] || 0) + 1),
    );
    p.areasOfExpertise.forEach(
      (t) =>
        (allAreaOfExpertise[t.name] = (allAreaOfExpertise[t.name] || 0) + 1),
    );
    p.locations.forEach((t) => {
      if (!continent || t.continent.name === continent)
        allCountries[`${t.emoji} ${t.name}`] =
          (allCountries[`${t.emoji} ${t.name}`] || 0) + 1;
    });
    uniq(p.locations.map((t) => t.continent.name)).forEach(
      (continentName) =>
        (allContinents[continentName] =
          (allContinents[continentName] || 0) + 1),
    );
  });

  return {
    technologies: allTechnologies,
    areaOfExpertise: allAreaOfExpertise,
    countries: allCountries,
    continents: allContinents,
  };
}

export default function Partners({ subscription, preview }) {
  const {
    data: { posts1, posts2, posts3, partnersPage },
  } = useQuerySubscription(subscription);

  const posts = [...posts1, ...posts2, ...posts3];

  const countBySlug = posts.reduce((acc, post) => {
    acc[post.slug] = post._allReferencingShowcaseProjectsMeta.count;
    return acc;
  }, {});

  const highlightedSlugs = partnersPage.highlightedPartners.map((p) => p.slug);

  const ordered = [
    ...partnersPage.highlightedPartners,
    ...sortBy(
      posts.filter((p) => !highlightedSlugs.includes(p.slug)),
      [(x) => -(countBySlug[x.slug] || 0), 'slug'],
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

  const filteredCounters = calculateCounters(filtered, continentFilter);
  const noFilterCounters = calculateCounters(ordered, continentFilter);

  const someFilters =
    continentFilter ||
    countryFilter ||
    technologyFilter ||
    areaOfExpertiseFilter;

  const continentOptions = Object.entries(filteredCounters.continents)
    .sort(byCount)
    .map(toOption);

  const countryOptions = Object.entries(filteredCounters.countries)
    .sort(byCount)
    .map(toOption);

  const technologyOptions = Object.entries(filteredCounters.technologies)
    .sort(byCount)
    .map(toOption);

  const areaOfExpertiseOptions = Object.entries(
    filteredCounters.areaOfExpertise,
  )
    .sort(byCount)
    .map(toOption);

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
          <div className={s.filter}>
            <div className={s.filterLabel}>Filter by Continent</div>
            <ReactSelect
              isClearable
              formatOptionLabel={(option) =>
                `${option.value} (${noFilterCounters.continents[option.value]})`
              }
              options={continentOptions}
              onChange={(option) => {
                setContinentFilter(option ? option.value : null);
                setCountryFilter(null);
              }}
              value={
                continentFilter
                  ? continentOptions.filter((o) => o.value === continentFilter)
                  : null
              }
            />
          </div>
          <div className={s.filter}>
            <div className={s.filterLabel}>Filter by Country</div>

            <ReactSelect
              isClearable
              formatOptionLabel={(option) =>
                `${option.value} (${noFilterCounters.countries[option.value]})`
              }
              options={countryOptions}
              onChange={(option) => {
                setCountryFilter(option ? option.value : null);
              }}
              value={
                countryFilter
                  ? countryOptions.find((o) => o.value === countryFilter)
                  : null
              }
            />
          </div>
          <div className={s.filter}>
            <div className={s.filterLabel}>Filter by Technology</div>

            <ReactSelect
              isClearable
              formatOptionLabel={(option) => option.value}
              options={technologyOptions}
              onChange={(option) => {
                setTechnologyFilter(option ? option.value : null);
              }}
              value={
                technologyFilter
                  ? technologyOptions.find((o) => o.value === technologyFilter)
                  : null
              }
            />
          </div>
          <div className={s.filter}>
            <div className={s.filterLabel}>Filter by Area of expertise</div>

            <ReactSelect
              isClearable
              formatOptionLabel={(option) => option.value}
              options={areaOfExpertiseOptions}
              onChange={(option) => {
                setAreaOfExpertiseFilter(option ? option.value : null);
              }}
              value={
                areaOfExpertiseFilter
                  ? areaOfExpertiseOptions.find(
                      (o) => o.value === areaOfExpertiseFilter,
                    )
                  : null
              }
            />
          </div>
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
                    {post.locations.slice(0, 5).map((l) => (
                      <span key={l.emoji}>{l.emoji}</span>
                    ))}
                    {post.locations.length > 5 && (
                      <span className={s.moreLocations}>
                        {' + '}
                        {post.locations.length - 5} more
                      </span>
                    )}
                  </div>
                  <div className={s.postDescription}>
                    {toPlainText(post.shortDescription)}
                  </div>
                </div>
                {countBySlug[post.slug] !== 0 && (
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
