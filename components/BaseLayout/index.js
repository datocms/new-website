import Head from 'next/head';
import s from './style.module.css';
import { useRouter } from 'next/router';
import NProgress from 'components/NProgress';

export default function Layout({ preview, children }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <link rel="preload" href="/fonts/colfax-web-700.woff2" />
        <link rel="preload" href="/fonts/colfax-web-bold.woff2" />
        <link rel="preload" href="/fonts/tiempos-text-web-regular.woff2" />
        <link rel="preload" href="/fonts/tiempos-headline-web-semibold.woff2" />
        <link rel="preload" href="/fonts/colfax-web-regular.woff2" />
      </Head>
      <NProgress />
      {preview && (
        <a
          href={`/api/preview/stop?page=${router.pathname}`}
          className={s.preview}
        >
          Exit preview mode
        </a>
      )}
      {children}
    </>
  );
}
