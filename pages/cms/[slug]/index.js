import Layout from 'components/Layout';
import {
  gqlStaticPaths,
  gqlStaticProps,
  imageFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import gql from 'graphql-tag';
import { renderMetaTags } from 'react-datocms';
import Head from 'next/head';
import Hero from 'components/Hero';
import SmartMarkdown from 'components/SmartMarkdown';
import { highlightHtml } from 'components/Highlight';
import Wrapper from 'components/Wrapper';
import LazyImage from 'components/LazyImage';
import Button from 'components/Button';
import Checks from 'components/Checks';
import CdnMap from 'components/CdnMap';
import GitHubButton from 'components/GitHubButton';
import InterstitialTitle from 'components/InterstitialTitle';
import s from './style.module.css';
import TitleStripWithContent from 'components/TitleStripWithContent';
import GraphQlDemo from 'components/GraphQlDemo';
import ProgressiveImagesDemo from 'components/ProgressiveImagesDemo';
import Arrow3 from 'public/images/illustrations/arrow-sketch-1.svg';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import UseModularBlocks from 'components/UseModularBlocks';
import CodeExcerpt from 'components/CodeExcerpt';
import Quote from 'components/Quote';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Nike from 'public/images/logos/nike.svg';
import Linkedin from 'public/images/logos/linkedin.svg';
import LogosBar from 'components/LogosBar';
import TryDemoCta from 'components/TryDemoCta';
import Space from 'components/Space';
import VideoPlayer from 'components/VideoPlayer';

export const getStaticPaths = gqlStaticPaths(
  gql`
    query {
      landingPages: allLandingPages(first: 15) {
        slug
      }
    }
  `,
  'slug',
  ({ landingPages }) => landingPages.map(p => p.slug),
);

export const getStaticProps = gqlStaticProps(
  gql`
    query($slug: String!) {
      landing: landingPage(filter: { slug: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        name
        title(markdown: true)
        subtitle
        logo {
          url
        }
        content {
          ... on LandingCdnMapBlockRecord {
            title
            description(markdown: true)
            id
            _modelApiKey
          }
          ... on GraphqlDemoBlockRecord {
            id
            _modelApiKey
          }
          ... on LandingProgressiveImagesBlockRecord {
            title
            content(markdown: true)
            githubRepoTitle
            githubPackageName
            id
            _modelApiKey
          }
          ... on CodeExcerptBlockRecord {
            title(markdown: true)
            content(markdown: true)
            code
            language
            githubRepoTitle
            githubPackageName
            id
            _modelApiKey
          }
          ... on ModularBlocksBlockRecord {
            title(markdown: true)
            content(markdown: true)
            id
            _modelApiKey
          }
          ... on QuoteRecord {
            quote
            author
            id
            _modelApiKey
          }
          ... on LandingVideoBlockRecord {
            title
            content(markdown: true)
            video {
              video {
                streamingUrl
              }
            }
            id
            _modelApiKey
          }
          ... on TryDemoBlockRecord {
            id
            _modelApiKey
            title
            content(markdown: true)
            docsUrl
            screenshot {
              responsiveImage(
                imgixParams: { w: 600, h: 400, fit: crop, crop: top }
              ) {
                ...imageFields
              }
            }
            demo {
              code
              githubRepo
              deploymentType
            }
          }
        }
      }
    }

    ${seoMetaTagsFields}
    ${imageFields}
  `,
);

export default function UseCase({ landing, preview }) {
  return (
    <Layout preview={preview}>
      {landing && (
        <>
          <Head>{renderMetaTags(landing.seo)}</Head>
          <Hero
            kicker={<LazyImage className={s.logo} src={landing.logo.url} />}
            title={highlightHtml(landing.title)}
            subtitle={<SmartMarkdown>{landing.subtitle}</SmartMarkdown>}
          >
            <Checks checks={['Best practices', '30s setup']}>
              <Button
                fs="big"
                as="a"
                href="https://dashboard.datocms.com/deploy?repo=datocms/nextjs-demo"
              >
                Try our Next.js demo
              </Button>
            </Checks>
          </Hero>
          <Space top={2} bottom={2}>
            <LogosBar
              title="We power experiences for over half a billion users"
              clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Linkedin]}
            />
          </Space>

          {landing.content.map(block => (
            <React.Fragment key={block.id}>
              {block._modelApiKey === 'landing_cdn_map_block' && (
                <>
                  <Space top={3} bottom={1}>
                    <InterstitialTitle style="two">
                      {highlightHtml(block.title)}
                    </InterstitialTitle>
                  </Space>
                  <Wrapper>
                    <div className={s.copy}>
                      <SmartMarkdown>{block.description}</SmartMarkdown>
                    </div>
                  </Wrapper>
                  <Space bottom={2}>
                    <CdnMap />
                  </Space>
                </>
              )}
              {block._modelApiKey === 'graphql_demo_block' && (
                <TitleStripWithContent
                  kicker={<>GraphQL Content API</>}
                  title={<>Ask for what you need, get exactly that</>}
                  subtitle={
                    <>
                      Our Content Delivery API is built with GraphQL. That means
                      powerful developer tools, multiple resources in a single
                      request and complete control over the data your website
                      downloads.
                    </>
                  }
                >
                  <GraphQlDemo height={11}>
                    {async (typer, setResult) => {
                      typer.insert('{\n  blogPost {}\n}');
                      typer.moveTo(-3);

                      await typer.wait(1000);

                      typer.insert('\n');
                      typer.insert('\n  ', { moveCursor: false });
                      typer.indent(2);
                      await typer.type('title');
                      setResult({ blogPost: { title: 'Awesome post!' } });

                      await typer.wait(800);
                      typer.insert('\n');
                      typer.indent(2);

                      await typer.type('coverImage {');
                      typer.insert('}', { moveCursor: false });
                      await typer.wait(300);
                      typer.insert('\n');
                      typer.insert('\n    ', { moveCursor: false });
                      typer.indent(3);
                      await typer.wait(150);
                      await typer.type('url');
                      setResult({
                        blogPost: {
                          title: 'Awesome post!',
                          coverImage: {
                            url: 'https://datocms-assets.com/cover.png',
                          },
                        },
                      });
                      await typer.wait(1000);

                      await typer.moveTo(6, { animate: true });

                      await typer.type('\n');
                      typer.indent(2);

                      await typer.type('author {');
                      typer.insert('}', { moveCursor: false });
                      await typer.wait(300);
                      typer.insert('\n');
                      typer.indent(3);
                      typer.insert('\n    ', { moveCursor: false });
                      await typer.wait(150);
                      await typer.type('name');
                      setResult({
                        blogPost: {
                          title: 'Awesome post!',
                          coverImage: {
                            url: 'https://datocms-assets.com/cover.png',
                          },
                          author: { name: 'Mark Smith' },
                        },
                      });
                      await typer.wait(2000);

                      await typer.typeBackspace(12);
                      await typer.deleteForward(6);
                      await typer.typeBackspace(55);
                      await typer.deleteForward(3);

                      typer.reset();
                    }}
                  </GraphQlDemo>
                </TitleStripWithContent>
              )}
              {block._modelApiKey === 'landing_progressive_images_block' && (
                <Space top={3}>
                  <TitleStripWithContent
                    title={block.title}
                    subtitle={
                      <>
                        <SmartMarkdown>{block.content}</SmartMarkdown>
                        {block.githubPackageName && (
                          <div>
                            <div className={s.readMore}>
                              {block.githubRepoTitle}
                            </div>
                            <div className={s.button}>
                              <Arrow3 />
                              <GitHubButton
                                href={`https://github.com/datocms/${block.githubPackageName}`}
                              >
                                {block.githubPackageName}
                              </GitHubButton>
                            </div>
                          </div>
                        )}
                      </>
                    }
                  >
                    <ProgressiveImagesDemo />
                  </TitleStripWithContent>
                </Space>
              )}
              {block._modelApiKey === 'code_excerpt_block' && (
                <Space top={3}>
                  <TitleStripWithContent
                    title={highlightHtml(block.title)}
                    subtitle={
                      <>
                        <SmartMarkdown>{block.content}</SmartMarkdown>
                        {block.githubPackageName && (
                          <div>
                            <div className={s.readMore}>
                              {block.githubRepoTitle}
                            </div>
                            <div className={s.button}>
                              <Arrow3 />
                              <GitHubButton
                                href={`https://github.com/datocms/${block.githubPackageName}`}
                              >
                                {block.githubPackageName}
                              </GitHubButton>
                            </div>
                          </div>
                        )}
                      </>
                    }
                  >
                    <CodeExcerpt code={block.code} language={block.language} />
                  </TitleStripWithContent>
                </Space>
              )}
              {block._modelApiKey === 'modular_blocks_block' && (
                <Flag
                  style="good"
                  title={highlightHtml(block.title, {
                    highlightWith: FlagHighlight,
                  })}
                  image={UseModularBlocks}
                >
                  <SmartMarkdown>{block.content}</SmartMarkdown>
                </Flag>
              )}
              {block._modelApiKey === 'quote' && (
                <Quote
                  quote={highlightHtml(block.quote)}
                  author={block.author}
                />
              )}
              {block._modelApiKey === 'try_demo_block' && (
                <TryDemoCta
                  image={block.screenshot.responsiveImage}
                  title={block.title}
                  windowTitle={`${landing.name} + DatoCMS demo`}
                  description={<SmartMarkdown>{block.content}</SmartMarkdown>}
                  href={`https://dashboard.datocms.com/deploy?repo=${block.demo.githubRepo}`}
                  docsAs={block.docsUrl}
                />
              )}
              {block._modelApiKey === 'landing_video_block' && (
                <Space top={3}>
                  <TitleStripWithContent
                    title={highlightHtml(block.title)}
                    subtitle={<SmartMarkdown>{block.content}</SmartMarkdown>}
                  >
                    <div className={s.video}>
                      <VideoPlayer
                        controls
                        autoPlay
                        muted
                        loop
                        src={block.video.video.streamingUrl}
                      />
                    </div>
                  </TitleStripWithContent>
                </Space>
              )}
            </React.Fragment>
          ))}
        </>
      )}
    </Layout>
  );
}
