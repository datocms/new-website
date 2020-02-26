import DocPage, {
  unstable_getStaticProps as otherGetStaticProps,
} from 'pages/docs/content-management-api/[chunk]';

export const unstable_getStaticProps = otherGetStaticProps.bind(null, {
  params: { chunk: 'index' },
});

export default DocPage;
