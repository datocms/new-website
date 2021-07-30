import { renderMetaTags } from 'react-datocms';
import Head from 'next/head';

const DatoHead = ({ metaKeywords, slug, seo }) => (
  <Head>
    {slug && (
      <link
        rel="alternate"
        hrefLang="en"
        href={`https://datocms.com/features/${slug}`}
      />
    )}
    {seo && renderMetaTags(seo)}
    {metaKeywords && <meta name="keywords" content={metaKeywords} />}
  </Head>
);

export default DatoHead;
