import Changelog, {
  unstable_getStaticProps as paginatedGetStaticProps,
} from 'pages/product-updates/p/[page]';

export const unstable_getStaticProps = paginatedGetStaticProps.bind(null, {
  params: { page: '0' },
});

export default Changelog;
