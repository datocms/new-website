import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Wrapper from 'components/Wrapper';
import Head from 'next/head';
import Logo from 'public/images/logos/nuxt.svg';
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
import { gqlStaticProps, imageFields } from 'lib/datocms';
import gql from 'graphql-tag';
import Space from 'components/Space';

const code = `// pages/movie.vue

<template>
  <article>
    <h1>{{movie.title}}</h1>
    Release date: {{movie.releaseDate}}
  </article>
</template>

<script>
import { Image, toHead } from "vue-datocms";
import { request } from "~/lib/datocms";

const query = \`{
  movie(filter: { title: { eq: "Inception" } }) {
    title
    releaseDate
    actors {
      name
    }
  }
}\`;

export default {
  components: {
    "datocms-image": Image
  },
  async asyncData({ params }) {
    const endpoint = node.env.PREVIEW_MODE ?
      'https://graphql.datocms.com/preview' :
      'https://graphql.datocms.com/'

    return await request(endpoint, query);
  }
};
</script>
`;

export const getStaticProps = gqlStaticProps(
  gql`
    {
      upload(filter: { id: { eq: "1428425" } }) {
        responsiveImage(imgixParams: { w: 600, h: 400, fit: crop, crop: top }) {
          ...imageFields
        }
      }
    }
    ${imageFields}
  `,
);

export default function IntegrationsPage({ upload }) {
  return (
    <Layout noCta>
      <Head>
        <title>CMS for Nuxt.js - Admin interface for Nuxt.js sites</title>
      </Head>
      <Hero
        kicker={<Logo className={s.logo} />}
        title={
          <>
            The <Highlight>easiest way</Highlight> to manage content with
            Nuxt.js
          </>
        }
        subtitle={
          <>
            Nuxt.js makes it trivial to build scalable and fast Vue.js apps with
            server-side SEO. When it comes to authoring content, pair it with a
            CMS that’s been built for this use-case.
          </>
        }
      >
        <Checks checks={['Deploy on ZEIT', '30s setup']}>
          <Button
            fs="big"
            as="a"
            href="https://dashboard.datocms.com/deploy?repo=datocms/nextjs-demo"
          >
            Try our Nuxt.js demo
          </Button>
        </Checks>
      </Hero>

      <Space top={2} bottom={2}>
        <LogosBar
          title="We power experiences for over half a billion users"
          clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Linkedin]}
        />
      </Space>

      <Space top={1} bottom={1}>
        <InterstitialTitle style="two">
          If Nuxt.js is serverless,{' '}
          <Highlight>so&nbsp;your&nbsp;CMS should be</Highlight>
        </InterstitialTitle>
      </Space>
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
      <Space bottom={2}>
        <CdnMap />
      </Space>
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
      <Space top={3}>
        <TitleStripWithContent
          title={<>State of the art for responsive and progressive images</>}
          subtitle={
            <>
              <p>
                Serving optimized images is incredibly hard, but using our
                GraphQL Content API and our Vue.js component, you can implement
                lazy loaded, responsive images in one line of code. Avoid any
                layout jumping, offer instant previews of images while they
                load. It’s like magic.
              </p>
              <p>
                <div className={s.readMore}>
                  Read more about our Vue.js components!
                </div>
                <div className={s.button}>
                  <Arrow3 />
                  <GitHubButton href="https://github.com/datocms/vue-datocms">
                    vue-datocms
                  </GitHubButton>
                </div>
              </p>
            </>
          }
        >
          <ProgressiveImagesDemo />
        </TitleStripWithContent>
      </Space>

      <Space top={3}>
        <TitleStripWithContent
          title={
            <>
              DatoCMS Preview API ={' '}
              <Highlight>content editors happiness</Highlight>
            </>
          }
          subtitle={
            <>
              Thanks to{' '}
              <a
                href="https://nuxtjs.org/guide#server-rendered-universal-ssr-"
                target="_blank"
              >
                Nuxt server-rendering capabilities
              </a>{' '}
              you can easily deploy a clone of your production website that
              shows real-time previews of the changes you make to any content
              stored in Dato (text, images, videos). Give it a try, it's magic!
            </>
          }
        >
          <CodeExcerpt code={code} language="html" />
        </TitleStripWithContent>
      </Space>

      <Flag
        style="good"
        title={
          <>
            <FlagHighlight>A component-centric CMS</FlagHighlight>, just like
            Vue.js
          </>
        }
        image={UseModularBlocks}
      >
        <p>
          Thanks to Vue.js, Nuxt.js makes using components easy right from the
          get-go, and you should expect the same from your CMS. A
          component-based approach allows developers to clearly divide work
          amongst themselves and progress without having to rely on each other
          every step of the way.
        </p>
      </Flag>

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

      <TryDemoCta
        image={upload.responsiveImage}
        title="Start your new Nuxt.js project in minutes"
        windowTitle="Nuxt.js + DatoCMS demo"
        description="Learn from our best-practice project. Fully configured and deployed on ZEIT. Source included."
        href="https://dashboard.datocms.com/deploy?repo=datocms/nextjs-demo"
      />
    </Layout>
  );
}
