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
import RealtimeUpdatesDemo from 'components/RealtimeUpdatesDemo';
import TitleStripWithContent from 'components/TitleStripWithContent';
import Quote from 'components/Quote';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import VideoPlayer from 'components/VideoPlayer';
import Button from 'components/Button';
import s from './style.module.css';
import CodeExcerpt from 'components/CodeExcerpt';
import Space from 'components/Space';
import InterstitialTitle from 'components/InterstitialTitle';
import IntegrationsBanner from 'components/IntegrationsBanner';
import LazyImage from 'components/LazyImage';
import Bullets from 'components/Bullets';
import SuccessIcon from 'public/icons/regular/check-circle.svg';
import Link from 'next/link';

export const getStaticProps = gqlStaticProps(
  `
    {
      feature: feature(filter: { slug: { eq: "structured-content-cms" } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        slug
        seoH1
        yoastAnalysis
      }
      review: review(filter: { name: { eq: "Dominic Blain" } }) {
        ...reviewFields
      }
      integrations: allIntegrations(
        first: 100
      ) {
        id
        logo {
          url
        }
        integrationType {
          slug
        }
        squareLogo {
          url
        }
      }
    }
    ${seoMetaTagsFields}
    ${imageFields}
    ${reviewFields}
  `,
);

const VideoBrowser = (props) => {
  return (
    <div className={s.window}>
      <div className={s.windowBar}>
        <div />
      </div>
      <div className={s.browserBar}>
        <div className={s.addressBar} />
      </div>
      <VideoPlayer {...props} />
    </div>
  );
};

function StructuredText({ feature, preview, integrations, review }) {
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
            The smart way to store{' '}
            <Highlight>rich&#8209;text content</Highlight>
          </>
        }
        subtitle={
          <>
            Meet our all-encompassing solution designed with{' '}
            <strong>omnichannel</strong> in mind.{' '}
            <strong>Dato CMS structured content</strong>
            combines a powerful and flexible{' '}
            <strong>rich-text editor with a portable JSON format</strong> to
            store your content.
          </>
        }
      />

      <div id="main-content">
        <TitleStripWithContent
          seoAnalysis={seoAnalysis}
          kicker="Notion-like Structured content CMS"
          title={<>A delightfully focused writing&nbsp;experience</>}
          subtitle={
            <>
              Dato CMS Structured Content offers a beautiful,{' '}
              <strong>Notion-like editor</strong> designed for focus, with{' '}
              <strong>
                slash commands, markdown/keyboard shortcuts, and drag &amp; drop
              </strong>
              . Forget the mouse, and just start typing.
            </>
          }
        >
          <div className={s.video}>
            <VideoPlayer
              controls
              muted
              src="https://stream.mux.com/FcwaLceO4tvoUKflRIt0176Lli5llFLwW.m3u8"
              title="Notion headless CMS"
            />
          </div>
        </TitleStripWithContent>

        <Quote review={review} />

        <Space top={2} bottom={1}>
          <InterstitialTitle style="two">
            What problems does <Highlight>Structured&nbsp;Content</Highlight>{' '}
            solve?
          </InterstitialTitle>
        </Space>

        <Flag
          style="good"
          seoAnalysis={seoAnalysis}
          kicker="Customizable structured content CMS"
          title={
            <>
              Easily embed 100%{' '}
              <FlagHighlight style="good">custom blocks</FlagHighlight>
            </>
          }
          image={VideoBrowser}
          hideDot
          imageProps={{
            controls: false,
            autoPlay: true,
            title: keyword,
            src: 'https://stream.mux.com/5hKbBhhU7TF202HRvbivd1WWAKuGgmP0100.m3u8',
          }}
        >
          <p>
            Galleries, call-to-actions, polls, third-party embeds and widgets
            for YouTube, Twitter... these things have always been a problem to
            handle. Not with Dato CMS structured content: blocks are completely
            custom, can be{' '}
            <strong>
              moved around, edited and composed in any way you want
            </strong>
            , and creating them is a matter of seconds.
          </p>
        </Flag>

        <Flag
          style="good"
          seoAnalysis={seoAnalysis}
          kicker="Linking structured content"
          title={
            <>
              Hyper-link and reference{' '}
              <FlagHighlight style="good">entities</FlagHighlight>, not just
              URLs
            </>
          }
          image={VideoBrowser}
          hideDot
          imageProps={{
            controls: false,
            autoPlay: true,
            src: 'https://stream.mux.com/HWUevVMYGa01WRKd00nB5hHKe7GT1k10102n.m3u8',
            title: keyword,
          }}
        >
          <p>
            When you need to deliver content not only through the web, but on an&nbsp;
            <strong>ever-growing number of different mediums</strong> ranging
            from native apps, voice assistants, e-books, IoT, etc... that&#39;s
            when being able to only create hyperlinks to fixed web addresses
            starts to get to you. What you need is{' '}
            <strong>clear separation between content and presentation</strong>.
          </p>
        </Flag>

        <Space top={2} bottom={1}>
          <InterstitialTitle style="two">
            A portable JSON format, <Highlight>ready for omnichannel</Highlight>
          </InterstitialTitle>
        </Space>

        <Flag
          style="good"
          seoAnalysis={seoAnalysis}
          kicker="omnichannel CMS"
          title={
            <>
              Highly structured and <FlagHighlight>deeply typed</FlagHighlight>
            </>
          }
          image={CodeExcerpt}
          imageProps={{
            code: JSON.stringify(
              {
                schema: 'dast',
                document: {
                  type: 'root',
                  children: [
                    {
                      type: 'heading',
                      level: 1,
                      children: [
                        {
                          type: 'span',
                          value: 'Hello ',
                        },
                        {
                          type: 'span',
                          marks: ['strong'],
                          value: 'world!',
                        },
                      ],
                    },
                  ],
                },
              },
              null,
              2,
            ),
            language: 'json',
          }}
        >
          <p>
            The Structured Text field saves content in a JSON format called{' '}
            <code>dast</code> to{' '}
            <strong>ensure control of the information</strong> and the ability
            to unambiguously{' '}
            <strong>parse and serialize the content to any medium</strong>, with
            clear separation from presentation concerns.
          </p>
          <p>
            <Button
              as="a"
              fs="small"
              p="small"
              s="invert"
              href="/docs/structured-text/dast#datocms-abstract-syntax-tree--dast--specification"
              title="Structured text"
            >
              Learn about Structured Text format
            </Button>
          </p>
        </Flag>

        <IntegrationsBanner
          title={<>Easily integrable by&nbsp;design</>}
          bubbles={integrations
            .filter((i) =>
              ['static-generator', 'language', 'framework'].includes(
                i.integrationType.slug,
              ),
            )
            .slice(0, 30)
            .map((integration) => (
              <LazyImage
                key={integration.id}
                src={
                  integration.squareLogo
                    ? integration.squareLogo.url
                    : integration.logo.url
                }
              />
            ))}
        >
          <p>
            Structured Text format adheres to the{' '}
            <a href="https://unifiedjs.com/">Unified collective</a>, which
            offers a big ecosystem of utilities to parse, transform, manipulate,
            convert and serialize content of any kind. This makes{' '}
            <strong>
              converting from/to Structured Content extremely easy
            </strong>
            .
          </p>
          <p>
            <Button
              as="a"
              fs="small"
              p="small"
              s="invert"
              href="https://github.com/datocms/structured-text"
              title="Structured text"
            >
              Explore all the Structured Text utilities
            </Button>
          </p>
        </IntegrationsBanner>
        <Flag
          style="good"
          seoAnalysis={seoAnalysis}
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

export default StructuredText;
