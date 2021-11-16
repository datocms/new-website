import Hero from 'components/Hero';
import Highlight, { highlightStructuredText } from 'components/Highlight';
import Layout from 'components/Layout';
import LogosBar from 'components/LogosBar';
import Space from 'components/Space';
import Wrapper from 'components/Wrapper';
import { gqlStaticPropsWithSubscription, imageFields } from 'lib/datocms';
import Link from 'next/link';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import LittleCaesars from 'public/images/logos/new/little-caesars.svg';
import Mit from 'public/images/logos/new/mit.svg';
import Nhs from 'public/images/logos/new/nhs.svg';
import Vercel from 'public/images/logos/vercel.svg';
import Verizon from 'public/images/logos/verizon.svg';
import React from 'react';
import { Image as DatoImage, useQuerySubscription } from 'react-datocms';
import s from './style.module.css';
import Head from 'components/Head';

export const getStaticProps = gqlStaticPropsWithSubscription(
  `
    {
      posts: allSuccessStories {
        accentColor {
          hex
        }
        duotoneColor1 {
          hex
        }
        duotoneColor2 {
          hex
        }
        title { value }
        slug
        coverImage {
          url
          focalPoint { x y }
          responsiveImage(imgixParams: { ar: "16:9", w: 960, fit: crop, monochrome: "45000000", nr: 20, nrs: 20 }) {
            ...imageFields
          }
        }
        logo {
          url
        }
      }
    }

    ${imageFields}
  `,
  {
    requiredKeys: ['posts'],
  },
);

export default function Customers({ subscription, preview }) {
  const {
    data: { posts },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      <Head>
        <title>DatoCMS Success Stories</title>
      </Head>
      <Wrapper>
        <Hero
          kicker="Success stories"
          title={
            <>
              Powered by <Highlight>DatoCMS</Highlight>
            </>
          }
          subtitle={
            <>
              Learn how companies are building their next-generation digital
              products with structured, flexible content at their core
            </>
          }
        />

        <Space top={1} bottom={2}>
          <LogosBar
            clients={[
              Vercel,
              DeutscheTelekom,
              LittleCaesars,
              Nhs,
              Verizon,
              Mit,
            ]}
          />
        </Space>

        <div className={s.posts}>
          {posts.map((post) => (
            <Link href={`/customers/${post.slug}`} key={post.slug}>
              <a className={s.post}>
                <div className={s.postImage}>
                  <DatoImage data={post.coverImage.responsiveImage} />
                </div>
                <div className={s.postBody}>
                  <div className={s.postTitle}>
                    {highlightStructuredText(post.title)}
                  </div>
                  <img src={post.logo.url} className={s.postLogo} />
                </div>
              </a>
            </Link>
          ))}
        </div>
      </Wrapper>
    </Layout>
  );
}
