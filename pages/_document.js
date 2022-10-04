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
