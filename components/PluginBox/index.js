import { useMemo } from 'react';
import cn from 'classnames';
import LazyImage from 'components/LazyImage';
import s from './style.module.css';
import PluginIcon from 'public/icons/regular/puzzle-piece.svg';
import MaybeLink from 'components/MaybeLink';

export const LogoImage = ({ logo, style = 'pink' }) => (
  <div
    className={cn(s.logo, s[`${style}Logo`], {
      [s.square]: logo.width / logo.height < 1.7,
    })}
  >
    <div className={s.logoInner}>
      <LazyImage src={logo.url} />
    </div>
  </div>
);

const colours = [
  'azureLogo',
  'pinkLogo',
  'blueLogo',
  'greenLogo',
  'yellowLogo',
];

export const PluginImagePlacehoder = ({ hash }) => {
  const style = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < hash.length; i++) {
      sum += hash.charCodeAt(i);
    }
    return colours[sum % colours.length];
  }, [hash]);

  return (
    <div className={cn(s.logo, s[style], s.square)}>
      <div className={s.logoInner}>
        <PluginIcon height="100" />
      </div>
    </div>
  );
};

export default function PluginBox({
  title,
  image,
  description,
  actions,
  details,
  href,
  tag,
}) {
  return (
    <MaybeLink href={href} className={s.box} data-vercel-edit-target>
      {tag && <div className={s.boxTag}>{tag}</div>}
      {image}
      <div className={s.boxBody}>
        <div className={s.boxTitle}>{title}</div>
        <div className={s.boxDesc}>{description}</div>
        {actions && <div className={s.boxActions}>{actions}</div>}
        {details && <div className={s.boxDetails}>{details}</div>}
      </div>
    </MaybeLink>
  );
}
