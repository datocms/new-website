import cn from 'classnames';
import useSWR from 'swr';
import wretch from 'wretch';
import s from './style.module.css';

const fetcher = (url) => wretch(url).get().json();

const statusLabel = {
  down: 'Down',
  loading: 'Checking...',
};

export default function StatusBadge() {
  const { data: components } = useSWR(
    'https://status.datocms.com/.netlify/functions/component-status?days=1',
    fetcher,
  );

  const firstDownComponent = components?.find(
    (component) => component.status !== 'up',
  );

  const firstDownStatus = firstDownComponent?.status;

  return (
    <a
      href="https://status.datocms.com"
      target="_blank"
      className={cn(s.status, { [s.ok]: !firstDownStatus })}
      rel="noreferrer"
    >
      {firstDownStatus ? statusLabel[firstDownStatus] : 'All systems normal'}
    </a>
  );
}
