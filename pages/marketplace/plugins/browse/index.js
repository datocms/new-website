import Plugins, {
  getStaticProps as paginatedGetStaticProps,
} from 'pages/marketplace/plugins/browse/p/[page]';

export const getStaticProps = async ({ params, ...other }) =>
  paginatedGetStaticProps({ ...other, params: { page: '0' } });

export default Plugins;
