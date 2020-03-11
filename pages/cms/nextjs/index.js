import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Wrapper from 'components/Wrapper';
import Head from 'next/head';
import Logo from 'public/images/logos/next.svg';
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
const code = `// pages/movie.js

import { request } from 'graphql-request'

const query = \`{
  movie(filter: { title: { eq: "Inception" } }) {
    releaseDate
    actors {
      name
    }
  }
}\`

export async function getStaticProps({ preview }) {
  // If context.preview is true, append "/preview" to the API endpoint
  // to request draft data instead of published data.

  const endpoint = preview ?
    'https://graphql.datocms.com/preview' :
    'https://graphql.datocms.com/'

  const { movie } = await request(endpoint, query);

  return {
    props: { movie };
  }
}

export default MoviePage({ movie }) {
  ...
}`;

export default function IntegrationsPage({ page }) {
  return (
    <Layout noCta>
      <Head>
        <title>CMS for Next.js - Admin interface for Next.js sites</title>
      </Head>
      <Hero
        over={<Logo />}
        title={
          <>
            The <Highlight>easiest way</Highlight> to manage content with
            Next.js
          </>
        }
        subtitle={
          <>
            Next.js makes it trivial to build scalable and fast React apps with
            server-side SEO. When it comes to authoring content, pair it with a
            CMS that’s been built for this use-case.
          </>
        }
      >
        <Checks checks={['Deploy on ZEIT', '30s setup']}>
          <Button fs="big">Try our Next.js demo</Button>
        </Checks>
      </Hero>

      <div style={{ margin: '10vh 0' }}>
        <LogosBar
          title="We power experiences for over half a billion users"
          clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Linkedin]}
        />
      </div>

      <div style={{ margin: '5vh 0 5vh' }}>
        <InterstitialTitle style="two">
          If Next.js is serverless,{' '}
          <Highlight>so&nbsp;your&nbsp;CMS should be</Highlight>
        </InterstitialTitle>
      </div>
      <Wrapper>
        <div className={s.copy}>
          <p>
            If your content is always fetched from a single geographical
            location, there’s no point in building a website with a serverless
            architecture.
          </p>
          <p>
            <strong>
              DatoCMS offers your content from a CDN with edges all around the
              globe, minimizing latency.
            </strong>
          </p>
        </div>
      </Wrapper>
      <div style={{ marginBottom: '10vh' }}>
        <CdnMap />
      </div>
      <TitleStripWithContent
        kicker={<>GraphQL Content API</>}
        title={<>Ask for what you need, get exactly that</>}
        subtitle={
          <>
            Our Content Delivery API is built with GraphQL. That means powerful
            developer tools, multiple resources in a single request and complete
            control over the data your website downloads.
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
      <div style={{ marginTop: '15vh' }}>
        <TitleStripWithContent
          title={<>State of the art for responsive and progressive images</>}
          subtitle={
            <>
              <p>
                Serving optimized images is incredibly hard, but using our
                GraphQL Content API and our React component, you can implement
                lazy loaded, responsive images in one line of code. Avoid any
                layout jumping, offer instant previews of images while they
                load. It’s like magic.
              </p>
              <p>
                <div className={s.readMore}>
                  Read more about our React components!
                </div>
                <div className={s.button}>
                  <Arrow3 />
                  <GitHubButton href="https://github.com/datocms/react-datocms">
                    react-datocms
                  </GitHubButton>
                </div>
              </p>
            </>
          }
        >
          <ProgressiveImagesDemo />
        </TitleStripWithContent>
      </div>

      <div style={{ marginTop: '15vh' }}>
        <TitleStripWithContent
          title={
            <>
              Next.js preview mode + DatoCMS Preview API ={' '}
              <Highlight>Content editors happiness</Highlight>
            </>
          }
          subtitle={
            <>
              Since Next.js 9.3 you can take advantage of Preview Mode: that
              means now you can go static (and hyper-fast) with visitors and
              dynamic with content editors,{' '}
              <strong>giving them instant previews for their edits</strong>.
              That’s the best of both worlds, and pairs wonderfully with our
              GraphQL Preview endpoint.
            </>
          }
        >
          <CodeExcerpt code={code} language="javascript" />
        </TitleStripWithContent>
      </div>

      <Quote
        quote={
          <>
            I do heart Dato, my first choice CMS,{' '}
            <Highlight>
              always advocate my clients to treat CMS flexibility seriously.
            </Highlight>
          </>
        }
        author="Callum Flack, Owner at Callum Flack Design"
      />

      <Flag
        style="good"
        title={
          <>
            <FlagHighlight>A component-centric CMS</FlagHighlight>, just like
            React
          </>
        }
        image={UseModularBlocks}
      >
        <p>
          Thanks to React, Next.js makes using components easy right from the
          get-go, and you should expect the same from your CMS. A
          component-based approach allows developers to clearly divide work
          amongst themselves and progress without having to rely on each other
          every step of the way.
        </p>
      </Flag>
    </Layout>
  );
}
