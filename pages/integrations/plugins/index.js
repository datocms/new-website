import Plugins, {
  getStaticProps as paginatedGetStaticProps,
} from 'pages/integrations/plugins/p/[page]';

export const getStaticProps = async ({ params, ...other }) =>
  paginatedGetStaticProps({ ...other, params: { page: '0' } });

export default Plugins;
