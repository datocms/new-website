import PartnerProjects, {
  getStaticProps as paginatedGetStaticProps,
} from 'pages/partners/showcase/p/[page]';

export const getStaticProps = async ({ params, ...other }) =>
  paginatedGetStaticProps({ ...other, params: { page: '0' } });

export default PartnerProjects;
