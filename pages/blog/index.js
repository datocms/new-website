import Blog, {
  unstable_getStaticProps as paginatedGetStaticProps,
} from 'pages/blog/p/[page]';

export const unstable_getStaticProps = paginatedGetStaticProps.bind(null, {
  params: { page: '0' },
});

export default Blog;
