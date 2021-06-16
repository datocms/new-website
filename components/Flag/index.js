import React from 'react';
import Wrapper from 'components/Wrapper';
import s from './style.module.css';
import { useMemo, useState } from 'react';
import LazyImage from 'components/LazyImage';
import cn from 'classnames';
import seedrandom from 'seedrandom';

export default function Flag({
  style = 'neutral',
  title,
  subtitle,
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

  const imageEl =
    typeof image === 'string' ? (
      <LazyImage src={`/images/illustrations/${image}.svg`} />
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
          <h3 className={s.title}>{title}</h3>
          {subtitle && <div className={s.subtitle}>{subtitle}</div>}
          <div className={s.body}>{children}</div>
        </div>
      </div>
    </Wrapper>
  );
}

export function Highlight({ style = 'good', children }) {
  return <strong className={s[`${style}Highlight`]}>{children}</strong>;
}
