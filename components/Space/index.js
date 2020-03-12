import cn from 'classnames';
import s from './style.module.css';

const mt = [null, 'mt1', 'mt2', 'mt3', 'mt4'];
const mb = [null, 'mb1', 'mb2', 'mb3', 'mb4'];

export default function Space({ top, bottom, children }) {
  return <div className={cn(s[mt[top]], s[mb[bottom]])}>{children}</div>;
}
