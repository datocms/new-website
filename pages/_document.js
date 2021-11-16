import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="google-site-verification"
            content="wfOsq57h3qCQUTbHcX-4qEEY07vgi4KgH9rdT1ywwwc"
          />
          {[16, 32, 96, 192].map((size) => (
            <link
              rel="icon"
              sizes={`${size}x${size}`}
              href={`https://www.datocms-assets.com/205/1525789775-dato.png?w=${size}&amp;h=${size}`}
              type="image/png"
              key={size}
            />
          ))}
          <link
            rel="alternate"
            type="application/rss+xml"
            title="DatoCMS Blog"
            href="/blog.xml"
          />
          <link
            rel="alternate"
            type="application/rss+xml"
            title="DatoCMS Product Changelog"
            href="/product-changelog.xml"
          />
          <meta
            property="og:image"
            content="https://www.datocms-assets.com/205/1614353889-social.png?fit=max&amp;fm=jpg&amp;w=1000"
            key="meta-og:image"
          />
          <meta
            property="og:image:width"
            content="1450"
            key="meta-og:image:width"
          />
          <meta
            property="og:image:height"
            content="1452"
            key="meta-og:image:height"
          />
          <meta
            name="twitter:image"
            key="meta-twitter:image"
            content="https://www.datocms-assets.com/205/1614353889-social.png?fit=max&amp;fm=jpg&amp;w=1000"
          />
          <meta
            key="meta-twitter:card"
            name="twitter:card"
            content="summary_large_image"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
