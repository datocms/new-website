import Layout from 'components/Layout';
import Head from 'components/Head';
import { renderMetaTags } from 'react-datocms';
import {
  imageFields,
  reviewFields,
  gqlStaticProps,
  seoMetaTagsFields,
} from 'lib/datocms';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Workflow from 'components/Workflow';
import TitleStripWithContent from 'components/TitleStripWithContent';
import WorkflowPermissions from 'components/WorkflowPermissions';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Nike from 'public/images/logos/nike.svg';
import Vercel from 'public/images/logos/vercel.svg';
import LogosBar from 'components/LogosBar';
import Button from 'components/Button';
import Space from 'components/Space';

import s from './style.module.css';

export const getStaticProps = gqlStaticProps(
  `
    {
      feature: feature(filter: { slug: { eq: "workflow-cms" } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        slug
        seoH1
        yoastAnalysis
      }
      review: review(filter: { name: { eq: "Martijn Theuwissen" } }) {
        ...reviewFields
      }
    }
    ${seoMetaTagsFields}
    ${imageFields}
    ${reviewFields}
  `,
);

function Workflows({ feature, preview, review }) {
  const { keyword } = feature.yoastAnalysis;

  return (
    <Layout preview={preview}>
      <Head seo={feature.seo} slug={feature.slug} />
      <div className={s.wrapper}>
        <Hero
          keyword={keyword}
          kicker={feature.seoH1}
          title={
            <>
              <Highlight>Dato CMS supercharges</Highlight> your content approval
              workflow
            </>
          }
          subtitle={
            <>
              Stop spreading your <strong>editorial life-cycle</strong> around
              tens of different products.{' '}
              <strong>Dato CMS Workflow feature</strong> concentrates all eyes
              in one place.
            </>
          }
        />
        <div id="main-content">
          <TitleStripWithContent
            keyword={keyword}
            kicker={`Publishing workflow in your CMS`}
            title={<>Build your perfectly oiled content machine</>}
            subtitle={
              <>
                <p>
                  Set up a precise state machine to bring a draft content up to
                  the final publication through a series of intermediate,{' '}
                  <strong>fully customizable approval steps</strong>.
                </p>
                <Button
                  as="a"
                  fs="small"
                  p="small"
                  s="invert"
                  href="/docs/general-concepts/workflows"
                >
                  Learn more about Workflows
                </Button>
              </>
            }
          >
            <Workflow />
          </TitleStripWithContent>

          <Flag
            keyword={keyword}
            kicker={`Content management workflow`}
            style="good"
            title={
              <>
                Say goodbye to{' '}
                <FlagHighlight>content creation bottlenecks</FlagHighlight>
              </>
            }
            image="faces"
          >
            <p>
              Larger teams often stumble into disconnected systems, duplicate
              content, and inefficient workflows. Organizations invest more in
              content,{' '}
              <strong>but their ROI remains lower due to friction</strong>, and
              their content engines stall. Dato CMS{' '}
              <strong>Workflow feature fixes all this</strong>.
            </p>
          </Flag>

          <Flag
            keyword={keyword}
            kicker={`CMS approval workflow`}
            style="good"
            title={
              <>
                Define clear tasks{' '}
                <FlagHighlight>for every team member</FlagHighlight>
              </>
            }
            image={WorkflowPermissions}
            imageProps={{
              children: (
                <>
                  <p>
                    Can <strong>create</strong> new <strong>Articles</strong>
                  </p>

                  <p>
                    Can move new <strong>Articles</strong> from{' '}
                    <strong>Draft</strong> stage to <strong>In review</strong>
                  </p>

                  <p>
                    Can publish <strong>Articles</strong> in{' '}
                    <strong>Approved</strong> stage
                  </p>
                </>
              ),
            }}
          >
            <p>
              Using our improved roles and permissions system,{' '}
              <strong>
                you can specify exactly which team members are in charge
              </strong>{' '}
              of performing the necessary checks and operations on the content
              so that it can advance to the next step in the approval chain and
              the team never publishes something by mistake.
            </p>
          </Flag>

          <Flag
            keyword={keyword}
            kicker="Customizable workflow"
            style="good"
            title={
              <>
                Different content requires{' '}
                <FlagHighlight>different processes</FlagHighlight>
              </>
            }
            image="dato-svg-4-02"
          >
            <p>
              A system that is too rigid will only drive your team away from
              using it. With DatoCMS you don&#39;t have to follow the same
              processes for each content, but{' '}
              <strong>
                you can specify different workflows depending on the type of
                resource
              </strong>
              .
            </p>
          </Flag>

          <Space top={4}>
            <LogosBar
              title="We power experiences for over half a billion users"
              clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Vercel]}
            />
          </Space>
        </div>
      </div>
    </Layout>
  );
}

export default Workflows;
