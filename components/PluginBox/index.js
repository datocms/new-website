import cn from 'classnames';
import LazyImage from 'components/LazyImage';
import s from './style.module.css';
import { Line, Copy, Image } from 'components/FakeContent';

export const LogoImage = ({ logo }) => (
  <div className={cn(s.logo, { [s.square]: logo.width / logo.height < 1.7 })}>
    <LazyImage src={logo.url} />
  </div>
);

export default function PluginBox({
  isFallback,
  title,
  image,
  description,
  actions,
}) {
  return (
    <div className={s.box}>
      {isFallback ? <Image /> : image}
      <div className={s.boxBody}>
        <div className={s.boxTitle}>{isFallback ? <Line /> : title}</div>
        <div className={s.boxDesc}>{isFallback ? <Copy /> : description}</div>
        {actions && <div className={s.boxActions}>{actions}</div>}
      </div>
    </div>
  );
}
