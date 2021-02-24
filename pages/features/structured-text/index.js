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

function ImagesApi({ page, preview, integrations }) {
  return (
    <Layout preview={preview}>
      <Head>
        {renderMetaTags(page.seo)}
        <title>Structured Text - Features</title>
      </Head>

      <Hero
        kicker="Structured Text"
        title={
          <>
            The smart way to store{' '}
            <Highlight>rich&#8209;text content</Highlight>
          </>
        }
        subtitle={
          <>
            Meet our all-encompassing solution designed with omnichannel in
            mind. It combines a powerful and flexible rich-text editor with a
            portable JSON format to store your content.
          </>
        }
      />

      <TitleStripWithContent
        title={<>A delightfully focused writing&nbsp;experience</>}
        subtitle={
          <>
            Structured Text offers a beautiful, Notion-like editor designed for
            focus, with slash commands, markdown/keyboard shortcuts, and drag
            &amp; drop. Forget the mouse, and just start typing.
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

      <Space top={2} bottom={1}>
        <InterstitialTitle style="two">
          What problems solve <Highlight>Structured&nbsp;Text</Highlight>{' '}
          content?
        </InterstitialTitle>
      </Space>

      <Flag
        style="good"
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
          muted: true,
          loop: true,
          src:
            'https://stream.mux.com/5hKbBhhU7TF202HRvbivd1WWAKuGgmP0100.m3u8',
        }}
      >
        <p>
          Galleries, call-to-actions, polls, third-party embeds and widgets for
          YouTube, Twitter... these things have always been a problem to handle.
          Not with DatoCMS: blocks are completely custom, can be composed in any
          way you want, and creating them is a matter of seconds.
        </p>
      </Flag>

      <Flag
        style="good"
        title={
          <>
            Hyper-link and reference{' '}
            <FlagHighlight style="good">entities</FlagHighlight>, not just URLs
          </>
        }
        image={VideoBrowser}
        hideDot
        imageProps={{
          controls: false,
          autoPlay: true,
          muted: true,
          loop: true,
          src: 'https://stream.mux.com/kgKny6B1uPoE01catGgWkMiICk6eUkfcf.m3u8',
        }}
      >
        <p>
          When you need to deliver content not only through the web, but on an
          ever-growing number of different mediums ranging from native apps,
          voice assistants, e-books, IoT, etc... that's when being able to only
          create hyperlinks to fixed web addresses starts to get to you. What
          you need is clear separation between between content and presentation.
        </p>
      </Flag>

      <Space top={2} bottom={1}>
        <InterstitialTitle style="two">
          A portable JSON format, <Highlight>ready for omnichannel</Highlight>
        </InterstitialTitle>
      </Space>

      <Flag
        style="good"
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
          Structured Text saves content in a JSON format called{' '}
          <code>dast</code> to ensure control of the information and the ability
          to unambiguously parse and serialize the content to any medium, with
          clear separation from presentation concerns.
        </p>
        <p>
          <Button
            as="a"
            fs="small"
            p="small"
            s="invert"
            href="/docs/structured-text/dast#datocms-abstract-syntax-tree--dast--specification"
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
          <a href="https://unifiedjs.com/">Unified collective</a>, which offers
          a big ecosystem of utilities to parse, transform, manipulate, convert
          and serialize content of any kind. This allows to convert from/to
          Structured Text extremely easy.
        </p>
        <p>
          <Button
            as="a"
            fs="small"
            p="small"
            s="invert"
            href="https://github.com/datocms/structured-text"
          >
            Explore all the Structured Text utilities
          </Button>
        </p>
      </IntegrationsBanner>
    </Layout>
  );
}

export default ImagesApi;
