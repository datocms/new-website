import Layout from 'components/Layout';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import {
  gqlStaticProps,
  seoMetaTagsFields,
  imageFields,
  reviewFields,
} from 'lib/datocms';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import CreateModularBlocks from 'components/CreateModularBlocks';
import UseModularBlocks from 'components/UseModularBlocks';
import LandingPagesGenerator from 'components/LandingPagesGenerator';
import Bullets from 'components/Bullets';
import SuccessIcon from 'public/icons/regular/check-circle.svg';
import Button from 'components/Button';
import Link from 'next/link';
import Quote from 'components/Quote';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';

export const getStaticProps = gqlStaticProps(
  `
    {
      page: homePage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
      review1: review(filter: { name: { eq: "Jasper Moelker" } }) {
        ...reviewFields
      }
      review2: review(filter: { name: { eq: "Marc Ammann" } }) {
        ...reviewFields
      }
    }
    ${seoMetaTagsFields}
    ${imageFields}
    ${reviewFields}
  `,
);

function DynamicLayouts({ page, preview, review1, review2 }) {
  return (
    <Layout preview={preview}>
      <Head>
        {renderMetaTags(page.seo)}
        <title>Dynamic layouts - Features</title>
      </Head>

      <Hero
        kicker="Dynamic layouts"
        title={
          <>
            Build dynamic layouts with{' '}
            <Highlight>modular&nbsp;blocks</Highlight>
          </>
        }
        subtitle={
          <>
            Define reusable custom components and build dynamic layouts for
            landing pages, micro websites, case studies and testimonials
          </>
        }
      />
      <div id="main-content">
        <Flag
          style="good"
          title={
            <>
              Create <FlagHighlight>modular&nbsp;blocks</FlagHighlight>
            </>
          }
          image={CreateModularBlocks}
        >
          <p>
            Modular blocks allow you to define reusable custom components that
            enable your writers to build rich stories.
          </p>
        </Flag>

        <Quote review={review2} />

        <Flag
          style="good"
          title={
            <>
              <FlagHighlight>Organize and structure</FlagHighlight> your content
            </>
          }
          image={UseModularBlocks}
        >
          <p>
            Modular blocks are very flexible and easy to use. You can stack
            &amp; reorganize them on the fly with drag and drop functionality.
          </p>
        </Flag>

        <Quote review={review1} />

        <Flag
          style="good"
          title={
            <>
              Easily build landing pages with{' '}
              <FlagHighlight>dynamic&nbsp;templates</FlagHighlight>
            </>
          }
          image={LandingPagesGenerator}
        >
          <p>
            Boost your acquisition and SEO by quickly creating rich and
            inspiring campaign pages featuring trends or events thanks to
            dynamic layouts.
          </p>
        </Flag>
        <Flag
          style="good"
          kicker={`The most user-friendly CMS`}
          title={
            <>
              A complete set of{' '}
              <FlagHighlight>smart,&nbsp;modern&nbsp;tools</FlagHighlight>
            </>
          }
          image="box-things"
        >
          <p>
            DatoCMS does not only offer composable and dynamic layouts, but a
            full, coordinated <strong>suite of different tools</strong> to give
            you the best editing and development experience. Find out why we are
            famous for being <strong>the most user-friendly CMS</strong>:
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
                href="/features/headless-cms-multi-language"
                title={'Headless CMS multilanguage'}
                key="headless-cms-multi-language"
              >
                <a>A complete set of multilanguage features</a>
              </Link>,
              <Link
                href="/features/workflow-cms"
                title={'workflow CMS'}
                key="workflow-cms"
              >
                <a>Organization of your workflow</a>
              </Link>,
              <Link
                href="/features/structured-content-cms"
                title={'Structured Content CMS'}
                key="structured-content-cms"
              >
                <a>A flowless editing experience</a>
              </Link>,
            ]}
          />
        </Flag>
      </div>
    </Layout>
  );
}

export default DynamicLayouts;
