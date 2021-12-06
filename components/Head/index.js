import { renderMetaTags } from 'react-datocms';
import Head from 'next/head';
import { useRouter } from 'next/router';

const DatoHead = ({ seo, children, canonicalUrl }) => {
  const router = useRouter();
  const pageUrl = `https://www.datocms.com${router.asPath.split('?')[0]}`;

  return (
    <Head>
      {seo && renderMetaTags(seo)}
      {children}
      <link rel="alternate" hrefLang="en" href={pageUrl} />
      <link rel="canonical" href={canonicalUrl || pageUrl} />
    </Head>
  );
};

export default DatoHead;
