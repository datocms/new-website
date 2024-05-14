import { renderMetaTags } from 'react-datocms';
import Head from 'next/head';
import { useRouter } from 'next/router';

const DatoHead = ({ seo, children, canonicalUrl, noIndex }) => {
  const router = useRouter();
  const pageUrl = `https://www.datocms.com${router.asPath.split('?')[0]}`;

  return (
    <>
      <Head>
        <meta
          property="og:image"
          content="https://www.datocms-assets.com/205/1614353889-social.png?fit=max&amp;fm=jpg&amp;w=1200"
          key="meta-og:image"
        />
        <meta
          name="twitter:image"
          key="meta-twitter:image"
          content="https://www.datocms-assets.com/205/1614353889-social.png?fit=max&amp;fm=jpg&amp;w=1200"
        />
        <meta key="meta-twitter:card" name="twitter:card" content="summary" />
        <link rel="alternate" hrefLang="en" href={pageUrl} />
        <link rel="canonical" href={canonicalUrl || pageUrl} />
        {noIndex && <meta name="robots" content="noindex" />}
      </Head>
      {seo && <Head>{renderMetaTags(seo)}</Head>}
      {children && <Head>{children}</Head>}
    </>
  );
};

export default DatoHead;
