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
import Workflow from 'components/Workflow';
import Button from 'components/Button';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Nike from 'public/images/logos/nike.svg';
import Vercel from 'public/images/logos/vercel.svg';
import LogosBar from 'components/LogosBar';
import SandboxEnvironmentsDemo from 'components/SandboxEnvironmentsDemo';
import Space from 'components/Space';
import Bullets from 'components/Bullets';
import SuccessIcon from 'public/icons/regular/check-circle.svg';
import Link from 'next/link';
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

      <div className={s.wrapper}>
        <Hero
          kicker="Data integrity"
          title={
            <>
              <Highlight>Safety &amp; content integrity</Highlight>, at the core
              of every choice
            </>
          }
          subtitle={
            <>
              Clean data is timeless data. Discover how DatoCMS enables you to
              achieve peace of mind by taking care of everything that can
              jeopardize the health and longevity of your content.
            </>
          }
        />

        <div id="main-content">
          <Space top={2} bottom={2}>
            <InterstitialTitle style="two">
              Is your CMS worrying about all this stuff for you?
            </InterstitialTitle>
          </Space>

          <Flag
            style="good"
            title={
              <>
                <FlagHighlight>Clean content, at every stage</FlagHighlight>{' '}
                with field validations
              </>
            }
            image={FieldValidations}
          >
            <p>
              Each and every content type in modules and blocks can be
              restricted to allow only specific types of content. Be it a
              picture of a certain size, a data range, a color, a unique slug or
              a pre-built value, DatoCMS allows workflow creation{' '}
              <strong>that ensures mistakes cannot be made</strong>.
            </p>
          </Flag>

          <Space bottom={4}>
            <TitleStripWithContent
              title={
                <>
                  Test upcoming website updates, without breaking the live
                  website
                </>
              }
              subtitle={
                <>
                  <p>
                    Using migration scripts, you can test changes in the
                    structure of your content{' '}
                    <strong>in a safe sandbox environment</strong>, and replay
                    the same exact changes in production once you&#39;re ready
                    to go live.
                  </p>
                  <Button
                    as="a"
                    fs="small"
                    p="small"
                    s="invert"
                    href="/docs/scripting-migrations/introduction"
                  >
                    Learn more about Sandbox Environments
                  </Button>
                </>
              }
            >
              <SandboxEnvironmentsDemo />
            </TitleStripWithContent>
          </Space>

          <Flag
            style="good"
            title={
              <>
                Specify <FlagHighlight>who can do what, and when</FlagHighlight>{' '}
                with custom permissions
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
                    Can <strong>publish</strong> existing{' '}
                    <strong>Products</strong>
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
              <strong>Build your editorial workflow role by role</strong>,
              across projects, languages, environments, timezones and modules.
            </p>
          </Flag>

          <TitleStripWithContent
            title={<>Ensure nothing gets published by mistake</>}
            subtitle={
              <>
                <p>
                  With our Workflows feature you can set up a precise state
                  machine to bring a draft content up to the final publication
                  through a series of intermediate, fully customizable approval
                  steps.
                </p>
                <p>
                  Define clear tasks for each team members, specifying exactly{' '}
                  <strong>
                    who is in charge of performing the necessary checks
                  </strong>{' '}
                  and operations on the content so that it can advance to the
                  next step in the approval chain.
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
              DatoCMS does not only offer a powerful editor, but a full,
              coordinated <strong>suite of different tools</strong> to give you
              the best writing and development experience. Find out why we are
              famous for being <strong>the most user-friendly CMS</strong>:
            </p>
            <Bullets
              style="good"
              icon={SuccessIcon}
              bullets={[
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

        <Space top={2} bottom={2}>
          <LogosBar
            title="We power experiences for over half a billion users"
            clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Vercel]}
          />
        </Space>
      </div>
    </Layout>
  );
}

export default Validations;
