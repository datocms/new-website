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
      review1: review(filter: { id: { eq: "159108" } }) {
        ...reviewFields
      }
      review2: review(filter: { id: { eq: "4368427" } }) {
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
          Modular blocks are very flexible and easy to use. You can stack &amp;
          reorganize them on the fly with drag and drop functionality.
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
          Boost your acquisition and SEO by quickly creating rich and inspiring
          campaign pages featuring trends or events thanks to dynamic layouts.
        </p>
      </Flag>
    </Layout>
  );
}

export default DynamicLayouts;
