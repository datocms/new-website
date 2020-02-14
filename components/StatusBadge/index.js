import useSWR from 'swr';
import fetch from 'unfetch';
import cn from 'classnames';
import s from './style.css';

const fetcher = async url => {
  const response = await fetch(url);
  return response.json();
};

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
    <div className={s.root}>
      <div className={cn(s.status, { [s.ok]: !firstDownStatus })}>
        {firstDownStatus ? statusLabel[firstDownStatus] : 'All systems normal'}
      </div>
    </div>
  );
}
