import Layout from 'components/Layout';
import Head from 'components/Head';
import {
  imageFields,
  reviewFields,
  gqlStaticProps,
  seoMetaTagsFields,
} from 'lib/datocms';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import GraphQlDemo from 'components/GraphQlDemo';
import TitleStripWithContent from 'components/TitleStripWithContent';
import VideoPlayer from 'components/VideoPlayer';
import Quote from 'components/Quote';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Bullets from 'components/Bullets';
import SuccessIcon from 'public/icons/regular/check-circle.svg';
import Link from 'next/link';

import s from './style.module.css';

export const getStaticProps = gqlStaticProps(
  `
    {
      feature: feature(filter: { slug: { eq: "headless-cms-graphql" } }) {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        slug
        seoH1
        yoastAnalysis
      }
      review(filter: { name: { eq: "Ryan Harris" } }) {
        ...reviewFields
      }
    }
    ${imageFields}
    ${reviewFields}
    ${seoMetaTagsFields}
  `,
);

function GraphQlContentApi({ feature, preview, review }) {
  const { keyword } = feature.yoastAnalysis;

  return (
    <Layout preview={preview}>
      <Head seo={feature.seo} slug={feature.slug} />
      <Hero
        keyword={keyword}
        kicker={feature.seoH1}
        title={
          <>
            GraphQL means <Highlight>superior developer experience</Highlight>
          </>
        }
        subtitle={
          <>
            <strong>
              GraphQL, in combination with a powerful headless CMS
            </strong>
            , provides <strong>faster responses</strong>, a complete and
            understandable <strong>description of your API</strong>, and enables
            great developer tools.
          </>
        }
      />
      <div id="main-content">
        <TitleStripWithContent
          kicker={'The headless cms graphql revolution'}
          keyword={keyword}
          title={<>Ask for what you need, get exactly that</>}
          subtitle={
            <>
              Contrary to the REST API dogma, a{' '}
              <strong>
                GraphQL query to your API gets exactly what you ask for
              </strong>
              , nothing more and nothing less.{' '}
              <strong>GraphQL queries always return predictable results</strong>
              . Apps using GraphQL are <strong>fast and stable</strong> because
              they control the data they get, not the server.
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
                  coverImage: { url: 'https://datocms-assets.com/cover.png' },
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
                  coverImage: { url: 'https://datocms-assets.com/cover.png' },
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

        <Quote review={review} />

        <TitleStripWithContent
          title={<>Move faster with powerful developer tools</>}
          subtitle={
            <>
              Know exactly what data you can request from your API{' '}
              <strong>without leaving your editor</strong>, highlight potential
              issues before sending a query, and take advantage of improved code
              intelligence. GraphQL makes it easy to build{' '}
              <strong>powerful tools like GraphiQL</strong> by leveraging your
              API’s type system.
            </>
          }
        >
          <div className={s.video}>
            <VideoPlayer
              controls
              autoPlay
              muted
              loop
              title={keyword}
              src="https://stream.mux.com/41n005I01cshC02vPeSunBhVOYGomfIUOd02.m3u8"
            />
          </div>
        </TitleStripWithContent>

        <TitleStripWithContent
          title={<>Get many resources in a single request</>}
          subtitle={
            <>
              GraphQL queries access not just the properties of one resource but
              also <strong>smoothly follow references between them</strong>.
              While typical REST APIs require loading from multiple URLs,
              GraphQL APIs get{' '}
              <strong>all the data your app needs in a single request</strong>.
              Apps using GraphQL can be{' '}
              <strong>quick even on slow mobile network connections</strong>.
            </>
          }
        >
          <GraphQlDemo height={12}>
            {async (typer, setResult) => {
              typer.insert('{\n  \n}');
              typer.moveTo(-2);
              await typer.wait(1000);

              await typer.wait(300);
              await typer.type('allProducts(first: 10) {');
              typer.insert('\n  }', { moveCursor: false });

              typer.insert('\n');
              typer.indent(2);
              await typer.type('title');

              setResult({
                allProducts: [
                  {
                    title: 'Y.A.S. Teddy Jacket',
                  },
                  {
                    title: 'Vintage inspired puffer gilet',
                  },
                ],
              });

              await typer.wait(500);

              typer.insert('\n');
              typer.indent(2);
              await typer.type('relatedProducts {');
              typer.insert('\n    }', { moveCursor: false });
              typer.insert('\n');
              typer.indent(3);
              await typer.wait(300);

              await typer.type('slug');
              setResult({
                allProducts: [
                  {
                    title: 'Y.A.S. Teddy Jacket',
                    relatedProducts: [{ slug: 'belted-wrap-coat' }],
                  },
                  {
                    title: 'Vintage inspired puffer gilet',
                    relatedProducts: [{ slug: 'denim-gilet' }],
                  },
                ],
              });
              await typer.wait(800);

              await typer.typeBackspace(12);
              await typer.deleteForward(6);
              await typer.typeBackspace(16);

              setResult({
                allProducts: [
                  {
                    title: 'Y.A.S. Teddy Jacket',
                  },
                  {
                    title: 'Vintage inspired puffer gilet',
                  },
                ],
              });

              await typer.wait(500);

              await typer.type('categories {');
              typer.insert('\n    }', { moveCursor: false });
              typer.insert('\n');
              typer.indent(3);
              await typer.wait(500);

              await typer.type('title');
              setResult({
                allProducts: [
                  {
                    title: 'Y.A.S. Teddy Jacket',
                    categories: [{ title: 'Jackets & Coats' }],
                  },
                  {
                    title: 'Vintage inspired puffer gilet',
                    categories: [{ title: 'Gilets' }],
                  },
                ],
              });
              await typer.wait(1000);

              await typer.typeBackspace(12);
              await typer.deleteForward(6);
              await typer.typeBackspace(16);
              await typer.typeBackspace(12);
              await typer.deleteForward(4);
              await typer.typeBackspace(23);

              typer.reset();
            }}
          </GraphQlDemo>
        </TitleStripWithContent>
        <Flag
          style="good"
          keyword={keyword}
          kicker={`#1 ${keyword}`}
          title={<>GraphQL + Dato headless CMS = 🚀 </>}
          image="rocket"
        >
          <p>
            <strong>
              DatoCMS headless CMS was envisioned with GraphQL in mind
            </strong>
            . We integrated a useful GraphQL API explorer directly in the editor
            backend, to make it even more natural to use it and experiment with
            it!
          </p>
        </Flag>

        <Flag
          style="good"
          keyword={keyword}
          kicker={`${keyword} + Worldwide CDN`}
          title={
            <>
              A complete set of{' '}
              <FlagHighlight>smart,&nbsp;modern&nbsp;APIs</FlagHighlight>
            </>
          }
          image="zen-garden"
        >
          <p>
            DatoCMS headless CMS does not only offer a{' '}
            <strong>powerful GraphQL API</strong> but a full coordinated suite
            of different <strong>APIs and tools</strong> to work seamlessly with
            the three fundamental blocks of content:{' '}
            <strong>text, images and video</strong>. Everything is built on CDN,{' '}
            <strong>optimized for speed and scalability</strong>.
          </p>

          <Bullets
            style="good"
            icon={SuccessIcon}
            bullets={[
              <Link
                href="/features/images-api"
                title={'Images API'}
                key="images-api"
              >
                <a>Images API</a>
              </Link>,
              <Link
                href="/features/worldwide-cdn"
                title={'Fastest headless CMS CDN'}
                key="worldwide-cdn"
              >
                <a>Worldwide CDN</a>
              </Link>,
              <Link
                href="/features/headless-cms-graphql"
                title={'Headless CMS GraphQL'}
                key="graphql-api"
              >
                <a>Content GraphQL API</a>
              </Link>,
              'Real-time updates API',
            ]}
          />
        </Flag>
      </div>
    </Layout>
  );
}

export default GraphQlContentApi;
