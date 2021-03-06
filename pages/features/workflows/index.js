import Layout from 'components/Layout';
import Head from 'next/head';
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
      page: homePage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
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

function Workflows({ page, preview, review }) {
  return (
    <Layout preview={preview}>
      <Head>
        {renderMetaTags(page.seo)}
        <title>Workflows - Features</title>
      </Head>
      <div className={s.wrapper}>
        <Hero
          kicker="Editorial workflows"
          title={
            <>
              <Highlight>Supercharge</Highlight> your content approval workflow
            </>
          }
          subtitle={
            <>
              Stop spreading your editorial life-cycle around tens of different
              products. DatoCMS&#39;s Workflows allow all eyes to be
              concentrated in one place.
            </>
          }
        />

        <TitleStripWithContent
          title={<>Build your perfectly oiled content machine</>}
          subtitle={
            <>
              <p>
                Set up a precise state machine to bring a draft content up to
                the final publication through a series of intermediate, fully
                customizable approval steps.
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
            their content engines stall. Our Workflows feature fixes all this.
          </p>
        </Flag>

        <Flag
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
            of performing the necessary checks and operations on the content so
            that it can advance to the next step in the approval chain and the
            team never publishes something by mistake.
          </p>
        </Flag>

        <Flag
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
            A system that is too rigid will only drive your team away from using
            it. With DatoCMS you don&#39;t have to follow the same processes for
            each content, but{' '}
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
    </Layout>
  );
}

export default Workflows;
