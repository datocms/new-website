import Layout from 'components/Layout';
import Head from 'components/Head';
import { renderMetaTags } from 'react-datocms';
import { gqlStaticProps, seoMetaTagsFields } from 'lib/datocms';
import Hero from 'components/Hero/Seo';
import Highlight from 'components/Highlight';
import IntegrationsBanner from 'components/IntegrationsBanner';
import LazyImage from 'components/LazyImage';
import ProjectSettings from 'components/ProjectSettings';
import FieldSettings from 'components/FieldSettings';
import TranslatedUI from 'components/TranslatedUI';
import Flag, { Highlight as FlagHighlight } from 'components/Flag/Seo';

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
  `
    {
      feature: feature(filter: { slug: { eq: "headless-cms-multi-language" } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        slug
        seoContent {
          ... on SeoBlockRecord {
            keyword
            h1
            imagesTitle
            metaKeywords
          }
        }
      }
    }
    ${seoMetaTagsFields}
  `,
);

function MultiLanguage({ feature, preview }) {
  const seoBlock = feature && feature.seoContent[0];

  return (
    <Layout preview={preview}>
      <Head
        metaKeywords={seoBlock.metaKeywords}
        seo={feature.seo}
        slug={feature.slug}
      />

      <Hero
        keyword={seoBlock.keyword}
        kicker={seoBlock.h1}
        title={
          <>
            Easily localize <Highlight>all&nbsp;your&nbsp;content</Highlight>,
            from start&nbsp;to&nbsp;finish
          </>
        }
        subtitle={
          <>
            Reach your <strong>global audience</strong> by choosing a{' '}
            <strong>headless CMS focused on multi language</strong>. Select from{' '}
            <strong>+400 different locales</strong> and publish multiple
            versions of your content in different languages to serve your
            content to the world.
          </>
        }
      />

      <Flag
        keyword={seoBlock.keyword}
        style="good"
        kicker={'Multi language & multi site headless cms'}
        title={
          <>
            Translate your <FlagHighlight>websites and apps</FlagHighlight>
          </>
        }
        image={ProjectSettings}
      >
        <p>
          <strong>Add all the languages you&#39;d like to support</strong> and
          start translating your content. Dato headless CMS will deliver your
          multi language content to your net of projects, using the same{' '}
          <strong>fast and scalable platform</strong>.
        </p>
      </Flag>

      <IntegrationsBanner
        title={<>Localize both content&nbsp;and&nbsp;assets</>}
        bubbles={icons.map((path) => (
          <LazyImage
            key={path}
            src={path}
            title={seoBlock.imagesTitle}
            alt={seoBlock.imagesTitle}
          />
        ))}
      >
        <strong>All your content and assets can be multi language</strong>,
        including rich text, responsive images, geo-points, SEO metadata and
        especially your URLs.
      </IntegrationsBanner>

      <Flag
        keyword={seoBlock.keyword}
        style="good"
        kicker="Multi language & flexible"
        title={
          <>
            Great <FlagHighlight>flexibility and granularity</FlagHighlight>
          </>
        }
        image={FieldSettings}
      >
        <p>
          Dato headless CMS gives you a{' '}
          <strong>great deal of customization</strong> for your multi language
          project. Specify which types of content need to be translated or not,
          and in which languages, on a per-field level. Feel free to set a field
          as localized, or change settings at any time, with{' '}
          <strong>no complex data migrations</strong>.
        </p>
      </Flag>

      <Flag
        keyword={seoBlock.keyword}
        style="good"
        kicker="Multi language headless CMS interface"
        title={
          <>
            <FlagHighlight>Translated</FlagHighlight> interface
          </>
        }
        image={TranslatedUI}
      >
        <p>
          It’s super important to offer an{' '}
          <strong>easy-to-understand editing experience</strong>
          to your non-technical editors. That’s why the interface is available
          in English, Spanish, German, French, Italian, Dutch, Russian and
          Turkish (and counting!).
        </p>
      </Flag>
    </Layout>
  );
}

export default MultiLanguage;
