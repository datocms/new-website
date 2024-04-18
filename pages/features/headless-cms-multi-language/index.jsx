import Bullets from 'components/Bullets';
import FieldSettings from 'components/FieldSettings';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import IntegrationsBanner from 'components/IntegrationsBanner';
import Layout from 'components/Layout';
import LazyImage from 'components/LazyImage';
import ProjectSettings from 'components/ProjectSettings';
import TranslatedUI from 'components/TranslatedUI';
import { gqlStaticProps, seoMetaTagsFields } from 'lib/datocms';
import Link from 'next/link';
import SuccessIcon from 'public/icons/regular/check-circle.svg';

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
  /* GraphQL */
  `
    {
      feature: feature(
        filter: { slug: { eq: "headless-cms-multi-language" } }
      ) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        slug
        seoH1
        yoastAnalysis
      }
    }
    ${seoMetaTagsFields}
  `,
);

function MultiLanguage({ feature, preview }) {
  const seoAnalysis = feature.yoastAnalysis;
  const { keyword } = seoAnalysis;

  return (
    <Layout preview={preview}>
      <Head seo={feature.seo} slug={feature.slug} />

      <Hero
        seoAnalysis={seoAnalysis}
        kicker={feature.seoH1}
        title={
          <>
            Easily localize <Highlight>all&nbsp;your&nbsp;content</Highlight>,
            from start&nbsp;to&nbsp;finish
          </>
        }
        subtitle={
          <>
            Reach your <strong>global audience</strong> by choosing a{' '}
            <strong>
              <Link href="/">headless CMS</Link> focused on multi-language
            </strong>
            . Select from <strong>+400 different locales</strong> and publish
            multiple versions of your content in different languages to serve
            your content to the world.
          </>
        }
      />

      <div id="main-content">
        <Flag
          seoAnalysis={seoAnalysis}
          style="good"
          kicker={'multi-language & multi-site headless cms'}
          title={
            <>
              Translate your <FlagHighlight>websites and apps</FlagHighlight>
            </>
          }
          image={ProjectSettings}
        >
          <p>
            <strong>
              Add all the languages you&#39;d like to support in your app
            </strong>{' '}
            and start translating your content, with our user-friendly
            multi-language interface. DatoCMS will deliver your content to your
            net of projects, using the same{' '}
            <strong>fast and scalable platform</strong>.
          </p>
        </Flag>

        <IntegrationsBanner
          title={<>Localize both content&nbsp;and&nbsp;assets</>}
          bubbles={icons.map((path) => (
            <LazyImage key={path} src={path} />
          ))}
        >
          <strong>All your content and assets can be multi-language</strong>,
          including rich text, responsive images, geo-points, SEO metadata and
          especially your URLs.
        </IntegrationsBanner>

        <Flag
          seoAnalysis={seoAnalysis}
          style="good"
          kicker="Headless CMS multi-language & flexible"
          title={
            <>
              Great <FlagHighlight>flexibility and granularity</FlagHighlight>
            </>
          }
          image={FieldSettings}
        >
          <p>
            DatoCMS gives you a <strong>great deal of customization</strong> for
            your multi-language project. Specify which types of content need to
            be translated or not, and in which languages, on a per-field level.
            Feel free to set a field as localized, or change settings at any
            time, with <strong>no complex data migrations</strong>.
          </p>
        </Flag>

        <Flag
          seoAnalysis={seoAnalysis}
          style="good"
          kicker="Multi-language headless CMS interface"
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
        <Flag
          style="good"
          seoAnalysis={seoAnalysis}
          kicker={`The most user-friendly headless CMS`}
          title={
            <>
              A complete set of{' '}
              <FlagHighlight>smart,&nbsp;modern&nbsp;tools</FlagHighlight>
            </>
          }
          image="box-things"
        >
          <p>
            DatoCMS does not only offer powerful multi-language features, but a
            full, coordinated <strong>suite of different tools</strong> to give
            you you the best editing and development experience. Find out why we
            are famous for being <strong>the most user-friendly CMS</strong>:
          </p>
          <Bullets
            style="good"
            icon={SuccessIcon}
            bullets={[
              <Link
                href="/features/data-integrity"
                title={'Fastest headless CMS CDN'}
                key="data-integrity"
              >
                <a>Safety and integrity of your content</a>
              </Link>,
              <Link
                href="/features/structured-content-cms"
                title={'Structured Content CMS'}
                key="structured-content-cms"
              >
                <a>A flowless editing experience</a>
              </Link>,
              <Link
                href="/features/workflow-cms"
                title={'workflow CMS'}
                key="workflow-cms"
              >
                <a>Organization of your workflow</a>
              </Link>,
              <Link
                href="/features/dynamic-layouts"
                title={'Dynamic Layouts'}
                key="dynamic-layouts"
              >
                <a>Dynamic & composable layouts</a>
              </Link>,
            ]}
          />
        </Flag>
      </div>
    </Layout>
  );
}

export default MultiLanguage;
