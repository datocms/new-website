import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Wrapper from 'components/Wrapper';
import Head from 'next/head';
import Logo from 'public/images/logos/gatsbyjs.svg';
import Button from 'components/Button';
import Checks from 'components/Checks';
import CdnMap from 'components/CdnMap';
import GitHubButton from 'components/GitHubButton';
import s from './style.module.css';
import TitleStripWithContent from 'components/TitleStripWithContent';
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
import ImgixTransformations from 'components/ImgixTransformations';
import { gqlStaticProps, imageFields } from 'lib/datocms';
import gql from 'graphql-tag';
import VideoPlayer from 'components/VideoPlayer';
import Space from 'components/Space';

const code = `import React from 'react';
import { graphql, Link } from 'gatsby';
import { HelmetDatoCms } from 'gatsby-source-datocms';

export const query = graphql\`
  query MoviePageQuery($title: String!) {
    movie: datoCmsMovie(title: { eq: $title }) {
      seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
      releaseDate
      actors {
        name
      }
      excerpt: excerptNode {
        md: childMarkdownRemark {
          html
        }
      }
    }
  }
\`;

export default function MoviePage({ data: { movie } }) {
  return (
    <Layout>
      <HelmetDatoCms seo={movie.seoMetaTags} />
      {/* .. */}
    <Layout>
  );
}`;

export const getStaticProps = gqlStaticProps(
  gql`
    {
      upload(filter: { id: { eq: "1428898" } }) {
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
        <title>CMS for GatsbyJS - Admin interface for GatsbyJS sites</title>
      </Head>
      <Hero
        kicker={<Logo className={s.logo} />}
        title={
          <>
            The <Highlight>easiest way</Highlight> to manage content with
            GatsbyJS
          </>
        }
        subtitle={
          <>
            You've got your high performance website, now you need blazing fast
            content. Well, we've got you covered.
          </>
        }
      >
        <Checks checks={['Deploy on Netlify/ZEIT', '30s setup']}>
          <Button
            fs="big"
            as="a"
            href="https://dashboard.datocms.com/projects/new-from-template/static-website/gatsby-portfolio"
          >
            Try our Gatsby demo
          </Button>
        </Checks>
      </Hero>

      <Space top={2} bottom={2}>
        <LogosBar
          title="We power experiences for over half a billion users"
          clients={[DeutscheTelekom, Hashicorp, Verizon, Nike, Linkedin]}
        />
      </Space>

      <Space top={3} bottom={3}>
        <TitleStripWithContent
          title={
            <>
              The <Highlight>best&nbsp;integration</Highlight> with GatsbyJS you
              can get
            </>
          }
          subtitle={
            <>
              <p>
                We work closely with our friends of the Gatsby team to always
                provide you best-in-class integration. Enjoy an awesome
                developer experience: live reloading of content as it gets
                saved, drop-in SEO, state-of-the-art integration with Gatsby's
                GraphQL API.
              </p>
              <p>
                <div className={s.readMore}>
                  Read more about our Gatsby source plugin!
                </div>
                <div className={s.button}>
                  <Arrow3 />
                  <GitHubButton href="https://github.com/datocms/gatsby-source-datocms">
                    gatsby-source-datocms
                  </GitHubButton>
                </div>
              </p>
            </>
          }
        >
          <CodeExcerpt code={code} language="javascript" />
        </TitleStripWithContent>
      </Space>

      <TitleStripWithContent
        title={<>Endless image transformations at your disposal</>}
        subtitle={
          <>
            DatoCMS, togheter with <code className={s.code}>gatsby-image</code>,
            offers best-in-class image processing and image CDN. Optimize,
            resize, crop, rotate and watermark images on-the-fly simply adding
            custom parameters to the URL of your image. Serve lazy loaded,
            responsive images in one line of code.
          </>
        }
      >
        <ImgixTransformations />
      </TitleStripWithContent>

      <Space top={3}>
        <TitleStripWithContent
          title={
            <>
              Real-time previews with&nbsp;
              <Highlight>Gatsby&nbsp;Cloud</Highlight>
            </>
          }
          subtitle={
            <>
              DatoCMS is fully compatible with{' '}
              <a href="https://www.gatsbyjs.com/cloud/">Gatsby Cloud</a>. Share
              temporary URLs for viewing changes immediately and in context, so
              you can make sure that new header plays nicely with the rest of
              the page before hitting “publish.”
            </>
          }
        >
          <div className={s.video}>
            <VideoPlayer
              controls
              autoPlay
              muted
              loop
              src="https://stream.mux.com/nIdnfyJSHXvSNNHChI01ffktHwLZ016AzK.m3u8"
            />
          </div>
        </TitleStripWithContent>
      </Space>

      <Flag
        style="good"
        title={
          <>
            <FlagHighlight>A component-centric CMS</FlagHighlight>, just like
            Gatsby
          </>
        }
        image={UseModularBlocks}
      >
        <p>
          Thanks to React, Gatsby makes using components easy right from the
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
        title="Start your new Gatsby project in minutes"
        windowTitle="Gatsby + DatoCMS demo"
        description="Learn from our best-practice project. Fully configured and deployed on Netlify/ZEIT. Source included."
        href="https://dashboard.datocms.com/projects/new-from-template/static-website/gatsby-portfolio"
        docsAs="/docs/gatsby"
      />
    </Layout>
  );
}
