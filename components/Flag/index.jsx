import cn from 'classnames';
import Heading from 'components/Heading';
import LazyImage from 'components/LazyImage';
import Wrapper from 'components/Wrapper';
import React, { useMemo, useState } from 'react';
import seedrandom from 'seedrandom';
import { containsKeywords } from 'utils/containsKeyword';
import slugify from 'utils/slugify';
import s from './style.module.css';

export default function Flag({
  style = 'neutral',
  title,
  subtitle,
  kicker,
  hideDot,
  image,
  imageProps,
  children,
  seoAnalysis,
  flip = false,
}) {
  const seed = useMemo(
    () => seedrandom(title + subtitle + style)(),
    [title, subtitle, style],
  );

  const [size] = useState(seed * 1.5 + 2);
  const [x] = useState(Math.floor(seed * 30));
  const [y] = useState(Math.floor(seed * 30) + 20);

  let Title;
  let Subtitle;
  let Kicker;

  if (seoAnalysis) {
    const kickerContainsKeywords = containsKeywords(kicker, seoAnalysis);

    Kicker = kickerContainsKeywords ? 'h2' : 'h3';
    Title = kicker && kickerContainsKeywords ? 'h3' : 'h2';
    Subtitle =
      subtitle && containsKeywords(subtitle, seoAnalysis) ? 'h4' : 'h6';
  } else {
    Kicker = 'h2';
    Title = 'h3';
    Subtitle = 'div';
  }

  const imageEl =
    typeof image === 'string' ? (
      <LazyImage
        src={`/images/illustrations/${image}.svg`}
        alt={kicker || `Headless DatoCMS ${image}`}
      />
    ) : image ? (
      React.createElement(
        image,
        kicker ? { ...imageProps, alt: kicker } : imageProps,
      )
    ) : (
      <span />
    );

  return (
    <Wrapper>
      <div className={cn(s.root, s[`${style}Root`], { [s.isFlipped]: flip })}>
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
          {kicker && (
            <Heading as={Kicker} className={s.kicker} anchor={slugify(kicker)}>
              {kicker}
            </Heading>
          )}
          {title && <Title className={s.title}>{title}</Title>}
          {subtitle && <Subtitle className={s.subtitle}>{subtitle}</Subtitle>}
          <div className={s.body}>{children}</div>
        </div>
      </div>
    </Wrapper>
  );
}

export function Highlight({ style = 'good', children }) {
  return <strong className={s[`${style}Highlight`]}>{children}</strong>;
}