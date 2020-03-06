import Layout from 'components/Layout';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import gql from 'graphql-tag';
import { gqlStaticProps, seoMetaTagsFields } from 'lib/datocms';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import IntegrationsBanner from 'components/IntegrationsBanner';
import LazyImage from 'components/LazyImage';
import ProjectSettings from 'components/ProjectSettings';
import FieldSettings from 'components/FieldSettings';
import TranslatedUI from 'components/TranslatedUI';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';

const icons = [
  '/images/flags/argentina.svg',
  '/images/flags/australia.svg',
  '/images/flags/austria.svg',
  '/images/flags/belgium.svg',
  '/images/flags/brazil.svg',
  '/images/flags/canada.svg',
  '/images/flags/china.svg',
  '/images/flags/denmark.svg',
  '/images/flags/england.svg',
  '/images/flags/finland.svg',
  '/images/flags/france.svg',
  '/images/flags/germany.svg',
  '/images/flags/greece.svg',
  '/images/flags/ireland.svg',
  '/images/flags/italy.svg',
  '/images/flags/mexico.svg',
  '/images/flags/netherlands.svg',
  '/images/flags/new-zealand.svg',
  '/images/flags/norway.svg',
  '/images/flags/portugal.svg',
  '/images/flags/russia.svg',
  '/images/flags/singapore.svg',
  '/images/flags/spain.svg',
  '/images/flags/sweden.svg',
  '/images/flags/switzerland.svg',
  '/images/flags/united-kingdom.svg',
  '/images/flags/united-states-of-america.svg',
];

export const getStaticProps = gqlStaticProps(
  gql`
    {
      page: homePage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
    }
    ${seoMetaTagsFields}
  `,
);

function MultiLanguage({ page, preview }) {
  return (
    <Layout preview={preview}>
      <Head>
        {renderMetaTags(page.seo)}
        <title>Multi-language - Features</title>
      </Head>

      <Hero
        over="Multi-language"
        title={
          <>
            Easily localize <Highlight>all&nbsp;your&nbsp;content</Highlight>,
            from&nbsp;start&nbsp;to&nbsp;finish
          </>
        }
        subtitle={
          <>
            Reach your global audience by publishing multiple versions of your
            content in different languages. Select from +400 different locales
            to serve your content to the world.
          </>
        }
      />

      <Flag
        style="good"
        title={
          <>
            Translate your <FlagHighlight>websites and apps</FlagHighlight>
          </>
        }
        image={ProjectSettings}
      >
        <p>
          Add languages you'd like to support and start providing translations.
          Translations are delivered using the same scalable platform.
        </p>
      </Flag>

      <IntegrationsBanner
        title={<>Localize both content&nbsp;and&nbsp;assets</>}
        bubbles={icons.map(path => (
          <LazyImage key={path} src={path} />
        ))}
      >
        All your content and assets are localizable, including rich text,
        responsive images, geo-points, SEO metadata and especially your URLs.
      </IntegrationsBanner>

      <Flag
        style="good"
        title={
          <>
            Great <FlagHighlight>flexibility and granularity</FlagHighlight>
          </>
        }
        image={FieldSettings}
      >
        <p>
          Specify which types of content need to be translated or not, and in
          which languages, on a per-field level. Feel free to set a field as
          localized, or change settings at any time, with no complex data
          migrations.
        </p>
      </Flag>

      <Flag
        style="good"
        title={
          <>
            <FlagHighlight>Translated interface</FlagHighlight>
          </>
        }
        image={TranslatedUI}
      >
        <p>
          It’s super important to offer an easy-to-understand editing experience
          to your non-technical editors. That’s why the interface is available
          in English, Spanish, German, French, Italian, Dutch, Russian and
          Turkish (and counting!).
        </p>
      </Flag>
    </Layout>
  );
}

export default MultiLanguage;
