import { renderMetaTags } from 'react-datocms';
import Head from 'next/head';
import { useRouter } from 'next/router';

const DatoHead = ({ seo, children, canonicalUrl, noIndex }) => {
  const router = useRouter();
  const pageUrl = `https://www.datocms.com${router.asPath.split('?')[0]}`;

  return (
    <Head>
      {seo && renderMetaTags(seo)}
      {children}
      <link rel="alternate" hrefLang="en" href={pageUrl} />
      <link rel="canonical" href={canonicalUrl || pageUrl} />
      {noIndex && <meta name="robots" content="noindex" />}
    </Head>
  );
};

export default DatoHead;
