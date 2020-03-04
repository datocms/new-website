import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import gql from 'graphql-tag';
import {
  gqlStaticProps,
  imageFields,
} from 'lib/datocms';

export const getStaticProps = gqlStaticProps(
  gql`
    query($first: IntType!, $skip: IntType!) {
      posts: allBlogPosts(
        first: $first
        skip: $skip
        orderBy: _firstPublishedAt_DESC
      ) {
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

      meta: _allBlogPostsMeta {
        count
      }
    }

    ${imageFields}
  `
);

export default function Support({ preview }) {
  return (
    <Layout preview={preview}>
      <Wrapper>
        <Hero
          title={
            <>
              <Highlight>Support page</Highlight>
            </>
          }
          subtitle="Got issues? We're here to help!"
        />
      </Wrapper>
    </Layout>
  );
}
