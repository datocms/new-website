import Blog, {
  getStaticProps as paginatedGetStaticProps,
} from 'pages/blog/p/[page]';

export const getStaticProps = async ({ params, ...other }) => (
  paginatedGetStaticProps({ ...other, params: { page: '0' }})
);

export default Blog;
