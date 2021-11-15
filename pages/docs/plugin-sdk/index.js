import DocPage, {
  getStaticProps as otherGetStaticProps,
} from 'pages/docs/plugin-sdk/[slug]';

export const getStaticProps = async ({ params, ...other }) => {
  return otherGetStaticProps({ ...other, params: { slug: 'index' } });
};

export default DocPage;
