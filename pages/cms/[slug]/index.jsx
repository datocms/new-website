import Button from 'components/Button';
import CdnMap from 'components/CdnMap';
import Checks from 'components/Checks';
import CodeExcerpt from 'components/CodeExcerpt';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import GitHubButton from 'components/GitHubButton';
import GraphQlDemo from 'components/GraphQlDemo';
import Head from 'components/Head';
import Hero from 'components/Hero';
import { highlightStructuredText } from 'components/Highlight';
import ImgixTransformations from 'components/ImgixTransformations';
import InterstitialTitle from 'components/InterstitialTitle';
import Layout from 'components/Layout';
import LazyImage from 'components/LazyImage';
import LogosBar from 'components/LogosBar';
import ProgressiveImagesDemo from 'components/ProgressiveImagesDemo';
import Quote from 'components/Quote';
import ShopifyProduct from 'components/ShopifyProduct';
import Space from 'components/Space';
import TitleStripWithContent from 'components/TitleStripWithContent';
import TryDemoCta from 'components/TryDemoCta';
import UiChrome from 'components/UiChrome';
import UseModularBlocks from 'components/UseModularBlocks';
import VideoPlayer from 'components/VideoPlayer';
import Wrapper from 'components/Wrapper';
import {
  gqlStaticPaths,
  handleErrors,
  imageFields,
  request,
  reviewFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import Link from 'next/link';
import Arrow3 from 'public/images/illustrations/arrow-sketch-1.svg';
import ArrowIcon from 'public/images/illustrations/arrow-usecase.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import Nike from 'public/images/logos/nike.svg';
import Vercel from 'public/images/logos/vercel.svg';
import Verizon from 'public/images/logos/verizon.svg';
import React, { useEffect } from 'react';
import { Image as DatoImage, StructuredText } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

export const getStaticPaths = gqlStaticPaths(
  `
    query {
      landingPages: allLandingPages(first: 100) {
        slug
      }
    }
  `,
  'slug',
  ({ landingPages }) => landingPages.map((p) => p.slug),
);

export const getStaticProps = handleErrors(
  async ({ params: { slug }, preview }) => {
    const gqlRequest = {
      preview,
      variables: { slug },
      query: `
      query($slug: String!) {
        landing: landingPage(filter: { slug: { eq: $slug } }) {
          seo: _seoMetaTags {
            ...seoMetaTagsFields
          }
          slug
          name
          title { value }
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
                imgixParams: { auto: format, w: 600, h: 400, fit: crop, crop: top }
              ) {
                ...imageFields
              }
            }
          }
          content {
            ... on LandingCdnMapBlockRecord {
              title { value }
              description { value }
              id
              _modelApiKey
            }
            ... on GraphqlDemoBlockRecord {
              id
              _modelApiKey
            }
            ... on LandingProgressiveImagesBlockRecord {
              title { value }
              content { value }
              githubRepoTitle
              githubPackageName
              id
              _modelApiKey
            }
            ... on CodeExcerptBlockRecord {
              title { value }
              content { value }
              code
              language
              githubRepoTitle
              githubPackageName
              id
              _modelApiKey
            }
            ... on ModularBlocksBlockRecord {
              title { value }
              content { value }
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
              title { value }
              content { value }
              video {
                width
                height
                video {
                  playbackId: muxPlaybackId
                }
              }
              id
              _modelApiKey
            }
            ... on ImageTransformationsBlockRecord {
              title { value }
              content { value }
              id
              _modelApiKey
            }
            ... on TryDemoBlockRecord {
              id
              _modelApiKey
              title { value }
              content { value }
            }
            ... on ShopifyProductRecord {
              id
              _modelApiKey
              shopifyProductId
            }
          }
          seoH1
          yoastAnalysis
        }
      }

      ${seoMetaTagsFields}
      ${imageFields}
      ${reviewFields}
    `,
    };

    const { data } = await request(gqlRequest);

    if (!data.landing) {
      return { notFound: true };
    }

    const {
      data: { websites },
    } = await request({
      preview,
      variables: { technologyId: data.landing.integration.id },
      query: `
      query($technologyId: ItemId!) {
        websites: allWebsites(
          filter: { technologies: { allIn: [$technologyId] } }
        ) {
          id
          title
          url
          image {
            responsiveImage(
              imgixParams: { auto: format, w: 400, h: 300, fit: crop, crop: top }
            ) {
              ...imageFields
            }
          }
        }
      }
      ${imageFields}
    `,
    });

    const sortedWebsites = [];

    websites.forEach((website, i) => {
      if (i % 2 === 0) {
        sortedWebsites.push(website);
      } else {
        sortedWebsites.unshift(website);
      }
    });

    return {
      props: {
        preview: preview || false,
        subscription: preview
          ? {
              ...gqlRequest,
              token: process.env.NEXT_PUBLIC_DATOCMS_READONLY_TOKEN,
              enabled: true,
              initialData: data,
            }
          : { enabled: false, initialData: data },
        websites: sortedWebsites,
      },
    };
  },
);

export default function UseCase({ subscription, websites, preview }) {
  const {
    data: { landing },
  } = useQuerySubscription(subscription);

  useEffect(() => {
    const el = document.getElementById('centerwebsite');

    if (el) {
      const rect = el.getBoundingClientRect();
      el.parentElement.parentElement.scroll({
        top: 0,
        left: el.offsetLeft - (window.innerWidth - rect.width) / 2,
        behavior: 'smooth',
      });
    }
  }, []);
  const seoAnalysis = landing?.yoastAnalysis;
  const keyword = seoAnalysis.keyword;

  return (
    <Layout preview={preview}>
      {landing && (
        <>
          <Head seo={landing.seo} slug={landing.slug} />
          <Hero
            kicker={landing.seoH1}
            seoAnalysis={seoAnalysis}
            image={
              <LazyImage
                className={s.logo}
                alt={`${keyword} logo`}
                src={
                  (landing.integration.squareLogo || landing.integration.logo)
                    .url
                }
              />
            }
            title={highlightStructuredText(landing.title)}
            subtitle={landing.subtitle}
          >
            {landing.demo && (
              <Checks checks={['Best practices', '30s setup']}>
                <Button
                  fs="big"
                  as="a"
                  title={keyword}
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
                <h5 className={s.poweredByTitle}>
                  Proudly powered by <strong>DatoCMS + {landing.name}</strong>:
                </h5>
              </Wrapper>
              <div className={s.websites}>
                <div className={s.websitesInner}>
                  {websites.map((website, i) => (
                    <div
                      key={website.id}
                      className={s.website}
                      id={
                        Number.parseInt(websites.length / 2) === i
                          ? 'centerwebsite'
                          : null
                      }
                    >
                      <UiChrome title={website.title} url={website.url}>
                        <DatoImage
                          className={s.websiteScreen}
                          data={{
                            ...website.image.responsiveImage,
                          }}
                        />
                      </UiChrome>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div id="main-content">
            {landing.content.map((block) => (
              <React.Fragment key={block.id}>
                {block._modelApiKey === 'landing_cdn_map_block' && (
                  <>
                    <Space top={4} bottom={1}>
                      <InterstitialTitle style="two" kicker={'Worldwide CDN'}>
                        {highlightStructuredText(block.title)}
                      </InterstitialTitle>
                    </Space>
                    <Wrapper>
                      <div className={s.copy}>
                        <StructuredText data={block.description} />
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
                    kicker={'GraphQL Content API'}
                    title={<>Ask for what you need, get exactly that</>}
                    seoAnalysis={seoAnalysis}
                    subtitle={
                      <>
                        <span>
                          Our Content Delivery API is{' '}
                          <strong>built with GraphQL</strong>. That means
                          powerful developer tools, multiple resources in a
                          single request and complete control over the data your
                          website downloads. The perfect solution for a{' '}
                          <strong>{keyword}</strong>
                        </span>
                        <span>
                          <Link
                            href="/features/headless-cms-graphql"
                            title={'Graphql CMS'}
                          >
                            <a className={s.readMoreAbout}>
                              Read more about our GraphQL API <ArrowIcon />
                            </a>
                          </Link>
                        </span>
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
                      kicker={`${landing.name} images`}
                      title={highlightStructuredText(block.title)}
                      seoAnalysis={seoAnalysis}
                      subtitle={
                        <>
                          <StructuredText data={block.content} />
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
                      <ProgressiveImagesDemo
                        name={`${landing.name} with DatoCMS`}
                      />
                    </TitleStripWithContent>
                  </Space>
                )}
                {block._modelApiKey === 'code_excerpt_block' && (
                  <Space top={3}>
                    <TitleStripWithContent
                      kicker={`${keyword} example`}
                      title={highlightStructuredText(block.title)}
                      seoAnalysis={seoAnalysis}
                      subtitle={
                        <>
                          <StructuredText data={block.content} />
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
                      <CodeExcerpt
                        code={block.code}
                        language={block.language}
                      />
                    </TitleStripWithContent>
                  </Space>
                )}
                {block._modelApiKey === 'modular_blocks_block' && (
                  <Flag
                    style="good"
                    seoAnalysis={seoAnalysis}
                    title={highlightStructuredText(block.title, {
                      highlightWith: FlagHighlight,
                    })}
                    image={UseModularBlocks}
                  >
                    <StructuredText data={block.content} />
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
                      title={highlightStructuredText(block.title)}
                      windowTitle={`${landing.name} + DatoCMS demo`}
                      description={<StructuredText data={block.content} />}
                      href={`https://dashboard.datocms.com/deploy?repo=${landing.demo.githubRepo}`}
                      docsAs={landing.docsUrl}
                      cta={`Try our ${landing.name} demo project now!`}
                    />
                    <Space top={2} bottom={2}>
                      <LogosBar
                        title="We power experiences for over half a billion users"
                        clients={[
                          <DeutscheTelekom key="DeutscheTelekom" />,
                          <Hashicorp key="Hashicorp" />,
                          <Verizon key="Verizon" />,
                          <Nike key="Nike" />,
                          <Vercel key="Vercel" />,
                        ]}
                      />
                    </Space>
                  </>
                )}
                {block._modelApiKey === 'shopify_product' && (
                  <>
                    <Space top={2} bottom={2}>
                      <ShopifyProduct block={block} />
                    </Space>
                  </>
                )}
                {block._modelApiKey === 'landing_video_block' && (
                  <Space top={3}>
                    <TitleStripWithContent
                      title={highlightStructuredText(block.title)}
                      seoAnalysis={seoAnalysis}
                      subtitle={<StructuredText data={block.content} />}
                    >
                      <div className={s.video}>
                        <VideoPlayer
                          autoPlayAndLoop
                          playbackId={block.video.video.playbackId}
                          width={block.video.width}
                          height={block.video.height}
                        />
                      </div>
                    </TitleStripWithContent>
                  </Space>
                )}
                {block._modelApiKey === 'image_transformations_block' && (
                  <Space top={3}>
                    <TitleStripWithContent
                      title={highlightStructuredText(block.title)}
                      seoAnalysis={seoAnalysis}
                      subtitle={
                        <>
                          <StructuredText data={block.content} />
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
          </div>
        </>
      )}
    </Layout>
  );
}
