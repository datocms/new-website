import s from './style.module.css';
import { useRouter } from 'next/router';
import NProgress from 'components/NProgress';
import CookiesManager from 'components/CookiesManager';

export default function Layout({ preview, children }) {
  const router = useRouter();

  return (
    <CookiesManager>
      <NProgress />
      {preview && (
        <a
          href={`/api/preview/stop?page=${router.asPath}`}
          className={s.preview}
        >
          Exit preview mode
        </a>
      )}
      <div className={s.root}>{children}</div>
    </CookiesManager>
  );
}
