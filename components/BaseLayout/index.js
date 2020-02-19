import Head from 'next/head';
import './style.css';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <link rel="preload" href="/fonts/colfax-web-700.woff2" />
        <link rel="preload" href="/fonts/colfax-web-bold.woff2" />
        <link rel="preload" href="/fonts/tiempos-text-web-regular.woff2" />
        <link rel="preload" href="/fonts/tiempos-headline-web-semibold.woff2" />
        <link rel="preload" href="/fonts/colfax-web-regular.woff2" />
      </Head>
      {children}
    </>
  );
}
