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
import Quote from 'components/Quote';

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
              Keep the whole editorial team{' '}
              <Highlight>on the same page</Highlight>
            </>
          }
          subtitle={
            <>
              Stop spreading your editorial life-cycle around tens of different
              products. DatoCMS's Workflows allow all eyes to be concentrated in
              one place.
            </>
          }
        />
        <TitleStripWithContent
          title={<>Build your perfectly oiled content machine</>}
          subtitle={
            <>
              Set up a precise state machine to bring a draft content up to the
              final publication through a series of intermediate, fully
              customizable approval steps.
            </>
          }
        >
          <Workflow />
        </TitleStripWithContent>

        <Flag
          style="good"
          title={
            <>
              Define clear tasks{' '}
              <FlagHighlight>for every team member</FlagHighlight>
            </>
          }
          image={WorkflowPermissions}
        >
          <p>
            Using our improved roles and permissions system, you can specify
            exactly which team members are in charge of performing the necessary
            checks and operations on the content so that it can advance to the
            next step in the approval chain and the team never publishes
            something by mistake.
          </p>
        </Flag>
      </div>

      <Quote review={review} />
    </Layout>
  );
}

export default Workflows;
