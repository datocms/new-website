import CustomerStories, {
  getStaticProps as paginatedGetStaticProps,
} from 'pages/customer-stories/p/[page]';

export const getStaticProps = async ({ params, ...other }) =>
  paginatedGetStaticProps({ ...other, params: { page: '0' } });

export default CustomerStories;
