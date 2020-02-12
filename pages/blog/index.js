import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Wrapper from 'components/Wrapper';
import Highlight from 'components/Highlight';
import { withDato } from 'lib/datocms';
import Link from 'next/link';
import { Image } from 'react-datocms';
import Masonry from 'react-masonry-css';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

import s from './style.css';

export const QUERY = gql`
  query IntegrationsBannerQuery($limit: IntType!) {
    allBlogPosts(first: $limit, orderBy: _firstPublishedAt_DESC) {
      slug
      title
      excerpt(markdown: true)
      coverImage {
        responsiveImage(imgixParams: { w: 550 }) {
          ...imageFields
        }
      }
      _firstPublishedAt
    }
  }

  fragment imageFields on ResponsiveImage {
    aspectRatio
    base64
    height
    sizes
    src
    srcSet
    width
    alt
    title
  }
`;

function Blog() {
  const { loading, error, data } = useQuery(QUERY, {
    variables: {
      limit: 30,
    },
  });

  if (loading || error) {
    return 'Loading...';
  }

  const { allBlogPosts: posts } = data;

  return (
    <Layout>
      <Hero
        title={<>Welcome to the <Highlight>DatoCMS&nbsp;Blog</Highlight></>}
        subtitle={<>News, tips and highlights from the team at DatoCMS</>}
      />
      <Wrapper>
        <Masonry
          breakpointCols={2}
          className={s.grid}
          columnClassName={s.column}
        >
          {posts.map(post => (
            <Link key={post.slug} href="/blog/[slug]" as={`/blog/${post.slug}`}>
              <a className={s.post}>
                <Image data={post.coverImage.responsiveImage} />
                <div className={s.postBody}>
                  <h6 className={s.title}>{post.title}</h6>
                  <div
                    className={s.excerpt}
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />
                  <div className={s.footer}>
                    <div className={s.date}>
                      Posted on {format(parseISO(post._firstPublishedAt), 'PPP')}
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </Masonry>
      </Wrapper>
    </Layout>
  );
}

export default withDato(Blog);
