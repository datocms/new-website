import React from 'react';
import Wrapper from 'components/Wrapper';
import s from './style.module.css';
import { useMemo, useState } from 'react';
import LazyImage from 'components/LazyImage';
import cn from 'classnames';
import seedrandom from 'seedrandom';
import containsKeyword from 'utils/containsKeyword';

export default function SeoFlag({
  style = 'neutral',
  title,
  subtitle,
  keyword,
  kicker,
  hideDot,
  image,
  imageProps,
  children,
}) {
  const seed = useMemo(
    () => seedrandom(title + subtitle + style)(),
    [title, subtitle, style],
  );

  const [size] = useState(seed * 1.5 + 2);
  const [x] = useState(Math.floor(seed * 30));
  const [y] = useState(Math.floor(seed * 30) + 20);

  const kickerWithSeo = containsKeyword(kicker, keyword) ? (
    <h2 className={s.kicker}>{kicker}</h2>
  ) : (
    <p className={s.kicker}>{kicker}</p>
  );

  const titleWithSeo = containsKeyword(title, keyword) ? (
    <h3 className={s.title}>{title}</h3>
  ) : (
    <p className={s.title}>{title}</p>
  );

  const subtitleWithSeo = containsKeyword(subtitle, keyword) ? (
    <h4 className={s.subtitle}>{subtitle}</h4>
  ) : (
    <div className={s.subtitle}>{subtitle}</div>
  );

  const imageEl =
    typeof image === 'string' ? (
      <LazyImage src={`/images/illustrations/${image}.svg`} title={image} />
    ) : image ? (
      React.createElement(image, imageProps)
    ) : (
      <span />
    );

  return (
    <Wrapper>
      <div className={cn(s.root, s[`${style}Root`])}>
        <div className={s.imageContainer}>
          {!hideDot && (
            <div
              className={s[`${style}Dot`]}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                height: `calc(var(--dotBaseUnit) * ${size})`,
                width: `calc(var(--dotBaseUnit) * ${size})`,
              }}
            />
          )}

          <div className={s.image}>{imageEl}</div>
        </div>
        <div className={s.content}>
          {kicker && kickerWithSeo}
          {title && titleWithSeo}
          {subtitle && subtitleWithSeo}
          <div className={s.body}>{children}</div>
        </div>
      </div>
    </Wrapper>
  );
}

export function Highlight({ style = 'good', children }) {
  return <strong className={s[`${style}Highlight`]}>{children}</strong>;
}
