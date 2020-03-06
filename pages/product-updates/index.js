import Changelog, {
  getStaticProps as paginatedGetStaticProps,
} from 'pages/product-updates/p/[page]';

export const getStaticProps = async ({ params, ...other }) =>
  paginatedGetStaticProps({ ...other, params: { page: '0' } });

export default Changelog;
