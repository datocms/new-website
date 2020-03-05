import cn from 'classnames';
import s from './style.module.css';
import { range } from 'range';

export const Text = ({ width = 100, style }) => (
  <div
    className={cn(s.loadingText, s.loading)}
    style={{ ...style, width: `${width}%` }}
  />
);

export const Line = props => <Copy lines={1} />;

export const Copy = ({ lines = 3 }) => (
  <>
    {range(0, lines).map(i => (
      <Text
        key={i}
        width={i === lines - 1 ? 50 : 100 - (i % 2 === 0 ? 3 : 0)}
      />
    ))}
  </>
);

export const Image = () => (
  <div className={cn(s.loading)} style={{ height: '30vh' }} />
);

export const Rect = ({ className, ...other }) => (
  <div className={cn(s.loading, className)} {...other} />
);
