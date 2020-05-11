import Layout from 'components/Layout';
import {
  gqlStaticPaths,
  request,
  imageFields,
  reviewFields,
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
import ImgixTransformations from 'components/ImgixTransformations';
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
import UiChrome from 'components/UiChrome';
import { Image } from 'react-datocms';
import Link from 'next/link';
import { useEffect } from 'react';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';

export const getStaticPaths = gqlStaticPaths(
  gql`
    query {
      landingPages: allLandingPages(first: 100) {
        slug
      }
    }
  `,
  'slug',
  ({ landingPages }) => landingPages.map((p) => p.slug),
);

export const getStaticProps = async ({ params: { slug }, preview }) => {
  const {
    data: { landing },
  } = await request({
    preview,
    variables: { slug },
    query: gql`
      query($slug: String!) {
        landing: landingPage(filter: { slug: { eq: $slug } }) {
          seo: _seoMetaTags {
            ...seoMetaTagsFields
          }
          name
          title(markdown: true)
          subtitle
          integration {
            id
            squareLogo {
              url
            }
            logo {
              url
            }
          }
          docsUrl
          demo {
            code
            githubRepo
            screenshot {
              responsiveImage(
                imgixParams: { w: 600, h: 400, fit: crop, crop: top }
              ) {
                ...imageFields
              }
            }
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
            ... on QuoteLinkRecord {
              quote {
                ...reviewFields
              }
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
            ... on ImageTransformationsBlockRecord {
              title
              content(markdown: true)
              id
              _modelApiKey
            }
            ... on TryDemoBlockRecord {
              id
              _modelApiKey
              title
              content(markdown: true)
            }
          }
        }
      }

      ${seoMetaTagsFields}
      ${imageFields}
      ${reviewFields}
    `,
  });

  const {
    data: { websites },
  } = await request({
    preview,
    variables: { technologyId: landing.integration.id },
    query: gql`
      query($technologyId: ItemId!) {
        websites: allWebsites(
          filter: { technologies: { allIn: [$technologyId] } }
        ) {
          id
          title
          url
          image {
            responsiveImage(
              imgixParams: { w: 400, h: 300, fit: crop, crop: top }
            ) {
              ...imageFields
            }
          }
        }
      }
      ${imageFields}
    `,
  });

  const sortedWebsites = websites.reduce((acc, website, i) => {
    if (i % 2 === 0) {
      return [...acc, website];
    } else {
      return [website, ...acc];
    }
  }, []);

  return {
    props: { preview: preview || false, landing, websites: sortedWebsites },
  };
};

export default function UseCase({ landing, websites, preview }) {
  useEffect(() => {
    const el = document.getElementById(`centerwebsite`);

    if (el) {
      const rect = el.getBoundingClientRect();
      el.parentElement.parentElement.scroll({
        top: 0,
        left: el.offsetLeft - (window.innerWidth - rect.width) / 2,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <Layout preview={preview}>
      {landing && (
        <>
          <Head>{renderMetaTags(landing.seo)}</Head>
          <Hero
            kicker={
              <LazyImage
                className={s.logo}
                src={
                  (landing.integration.squareLogo || landing.integration.logo)
                    .url
                }
              />
            }
            title={highlightHtml(landing.title)}
            subtitle={<SmartMarkdown>{landing.subtitle}</SmartMarkdown>}
          >
            {landing.demo && (
              <Checks checks={['Best practices', '30s setup']}>
                <Button
                  fs="big"
                  as="a"
                  href={`https://dashboard.datocms.com/deploy?repo=${landing.demo.githubRepo}`}
                >
                  Try our {landing.name} demo project now!
                </Button>
              </Checks>
            )}
          </Hero>

          {websites.length > 0 && (
            <div className={s.poweredBy}>
              <Wrapper>
                <div className={s.poweredByTitle}>
                  Proudly powered by <strong>DatoCMS + {landing.name}</strong>:
                </div>
              </Wrapper>
              <div className={s.websites}>
                <div className={s.websitesInner}>
                  {websites.map((website, i) => (
                    <div
                      key={website.id}
                      className={s.website}
                      id={
                        parseInt(websites.length / 2) === i
                          ? 'centerwebsite'
                          : null
                      }
                    >
                      <UiChrome title={website.title} url={website.url}>
                        <Image
                          className={s.websiteScreen}
                          data={website.image.responsiveImage}
                        />
                      </UiChrome>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {landing.content.map((block) => (
            <React.Fragment key={block.id}>
              {block._modelApiKey === 'landing_cdn_map_block' && (
                <>
                  <Space top={4} bottom={1}>
                    <InterstitialTitle style="two">
                      {highlightHtml(block.title)}
                    </InterstitialTitle>
                  </Space>
                  <Wrapper>
                    <div className={s.copy}>
                      <SmartMarkdown>{block.description}</SmartMarkdown>
                      <p>
                        <Link href="/features/worldwide-cdn">
                          <a className={s.readMoreAbout}>
                            Read more about our Worldwide CDN <ArrowIcon />
                          </a>
                        </Link>
                      </p>
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
                      <p>
                        Our Content Delivery API is built with GraphQL. That
                        means powerful developer tools, multiple resources in a
                        single request and complete control over the data your
                        website downloads.
                      </p>
                      <p>
                        <Link href="/features/graphql-content-api">
                          <a className={s.readMoreAbout}>
                            Read more about our GraphQL API <ArrowIcon />
                          </a>
                        </Link>
                      </p>
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
                            <div className={s.readMoreAbout}>
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
                            <div className={s.readMoreAbout}>
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
                  <p>
                    <Link href="/features/dynamic-layouts">
                      <a className={s.readMoreAbout}>
                        Read more about DatoCMS modular blocks <ArrowIcon />
                      </a>
                    </Link>
                  </p>
                </Flag>
              )}
              {block._modelApiKey === 'quote_link' && (
                <Quote review={block.quote} />
              )}
              {block._modelApiKey === 'try_demo_block' && landing.demo && (
                <>
                  <TryDemoCta
                    image={landing.demo.screenshot.responsiveImage}
                    title={block.title}
                    windowTitle={`${landing.name} + DatoCMS demo`}
                    description={<SmartMarkdown>{block.content}</SmartMarkdown>}
                    href={`https://dashboard.datocms.com/deploy?repo=${landing.demo.githubRepo}`}
                    docsAs={landing.docsUrl}
                    cta={`Try our ${landing.name} demo project now!`}
                  />
                  <Space top={2} bottom={2}>
                    <LogosBar
                      title="We power experiences for over half a billion users"
                      clients={[
                        DeutscheTelekom,
                        Hashicorp,
                        Verizon,
                        Nike,
                        Linkedin,
                      ]}
                    />
                  </Space>
                </>
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
              {block._modelApiKey === 'image_transformations_block' && (
                <Space top={3}>
                  <TitleStripWithContent
                    title={highlightHtml(block.title)}
                    subtitle={
                      <>
                        <SmartMarkdown>{block.content}</SmartMarkdown>
                        <p>
                          <Link href="/features/images-api">
                            <a className={s.readMoreAbout}>
                              Read more about DatoCMS Image API <ArrowIcon />
                            </a>
                          </Link>
                        </p>
                      </>
                    }
                  >
                    <ImgixTransformations />
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
