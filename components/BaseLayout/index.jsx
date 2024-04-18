import NProgress from 'components/NProgress';
import { useRouter } from 'next/router';
import s from './style.module.css';

export default function Layout({ preview, children }) {
  const router = useRouter();

  return (
    <>
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
    </>
  );
}
