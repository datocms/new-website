import useSWR from 'swr';
import cn from 'classnames';
import s from './style.module.css';
import wretch from 'wretch';

const fetcher = url =>
  wretch(url)
    .get()
    .json();

const statusLabel = {
  down: 'Down',
  loading: 'Checking...',
};

export default function StatusBadge() {
  const { data: components } = useSWR(
    'https://status.datocms.com/.netlify/functions/componentsStatus?days=1',
    fetcher,
  );

  const firstDownComponent =
    components && components.find(component => component.status !== 'up');

  const firstDownStatus = firstDownComponent && firstDownComponent.status;

  return (
    <a
      href="https://status.datocms.com"
      target="_blank"
      className={cn(s.status, { [s.ok]: !firstDownStatus })}
    >
      {firstDownStatus ? statusLabel[firstDownStatus] : 'All systems normal'}
    </a>
  );
}
