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
import TitleStripWithContent from 'components/TitleStripWithContent';
import WorkflowPermissions from 'components/WorkflowPermissions';
import FieldValidations from 'components/FieldValidations';
import InterstitialTitle from 'components/InterstitialTitle';
import VideoPlayer from 'components/VideoPlayer';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Nike from 'public/images/logos/nike.svg';
import Vercel from 'public/images/logos/vercel.svg';
import LogosBar from 'components/LogosBar';
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

function Validations({ page, preview, review }) {
  return (
    <Layout preview={preview}>
      <Head>
        {renderMetaTags(page.seo)}
        <title>Data integrity - Features</title>
      </Head>
      <Hero
        kicker="Data integrity"
        title={
          <>
            Clean data equals <Highlight>timeless&nbsp;data</Highlight>
          </>
        }
        subtitle={
          <>
            Put data cleanliness, content validations and security enforcement
            at the centre of all content creation process, across all price
            plans.
          </>
        }
      />

      <TitleStripWithContent
        title={<>Safety &amp; content integrity, at the core of every choice</>}
        subtitle={
          <>
            Discover how DatoCMS enables you to achieve peace of mind by taking
            care of everything that can jeopardize the health and longevity of
            your content for you.
          </>
        }
      >
        <div className={s.video}>
          <VideoPlayer
            controls
            muted
            loop
            src="https://stream.mux.com/FcwaLceO4tvoUKflRIt0176Lli5llFLwW.m3u8"
          />
        </div>
      </TitleStripWithContent>

      <Space top={2} bottom={2}>
        <InterstitialTitle style="two">
          Is your CMS worrying about all this stuff for you?
        </InterstitialTitle>
      </Space>

      <Flag
        style="good"
        title={
          <>
            Field validations, to ensure{' '}
            <FlagHighlight>clean content, at every stage</FlagHighlight>
          </>
        }
        image={FieldValidations}
      >
        <p>
          Each and every content type in modules and blocks can be restricted to
          allow only specific types of content. Be it a picture of a certain
          size, a data range, a color, a unique slug or a pre-built value,
          DatoCMS allows workflow creation{' '}
          <strong>that ensures mistakes cannot be made</strong>.
        </p>
      </Flag>

      <Flag
        style="good"
        title={
          <>
            Sandbox environments, to put you{' '}
            <FlagHighlight>in control of website updates</FlagHighlight>
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
          Traditional CMSs often treat content as a one-off effort, but that's
          just naive, wishful thinking. DatoCMS make it easy for your
          development team to{' '}
          <strong>
            test website updates without breaking the live website
          </strong>
          .
        </p>
        <p>
          Writing migration scripts, you can{' '}
          <strong>
            make changes in the structure of your content in a safe sandbox
            environment
          </strong>
          , and replay the same exact changes in production once you're ready to
          deploy.
        </p>
      </Flag>

      <Flag
        style="good"
        title={
          <>
            Custom permissions, to let you specify{' '}
            <FlagHighlight>who can do what, and when</FlagHighlight>
          </>
        }
        image={WorkflowPermissions}
        imageProps={{
          children: (
            <>
              <p>
                Can <strong>perform all actions</strong> on{' '}
                <strong>Articles</strong>
              </p>
              <p>
                Can <strong>create</strong> new <strong>Products</strong>
              </p>
              <p>
                Can <strong>publish</strong> existing <strong>Products</strong>
              </p>
              <p>
                Cannot <strong>delete</strong> existing{' '}
                <strong>Products</strong>
              </p>
            </>
          ),
        }}
      >
        <p>
          Roles can be customized to have explicit rules to perform specific
          actions. These can be assigned to multiple users to create team
          permissions.
        </p>
        <p>
          Specify exactly what each role can do and cannot do.{' '}
          <strong>Build your editorial workflow role by role</strong>, across
          projects, languages, environments, timezones and modules.
        </p>
      </Flag>

      <Space top={2} bottom={2}>
        <LogosBar
          title="We power experiences for over half a billion users"
          clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Vercel]}
        />
      </Space>
    </Layout>
  );
}

export default Validations;
