import Wrapper from 'components/Wrapper';
import s from './style.module.css';
import { animated, useSpring } from 'react-spring';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { useRef, useState } from 'react';
import LazyImage from 'components/LazyImage';
import clamp from 'clamp';
import cn from 'classnames';

export default function Flag({
  style = 'neutral',
  title,
  subtitle,
  image,
  children,
}) {
  const [size] = useState(Math.floor(Math.random() * 30) + 20);
  const [x] = useState(Math.floor(Math.random() * 40) + 20);
  const [y] = useState(Math.floor(Math.random() * 40) + 20);

  const elementRef = useRef(null);

  const [dotAnimStyle, setDotAnimStyle] = useSpring(() => ({
    transform: 'perspective(500px) rotateX(0deg) translateZ(-500px)',
  }));

  const imageEl =
    typeof image === 'string' ? (
      <LazyImage src={`/images/illustrations/${image}.svg`} />
    ) : image ? (
      React.createElement(image)
    ) : (
      <span />
    );

  useScrollPosition(
    ({ prevPos, currPos }) => {
      const rotation = clamp((prevPos.y - currPos.y) / 2, -10, 10);

      setDotAnimStyle({
        transform: `perspective(500px) rotateX(${rotation}deg) translateZ(-500px)`,
      });
    },
    [],
    elementRef,
    false,
  );

  return (
    <Wrapper>
      <div ref={elementRef} className={cn(s.root, s[`${style}Root`])}>
        <div className={s.imageContainer}>
          <animated.div
            className={s[`${style}Dot`]}
            style={{
              ...dotAnimStyle,
              left: `${x}%`,
              top: `${y}%`,
              height: `${size}vh`,
              width: `${size}vh`,
            }}
          />
          <animated.div className={s.image}>{imageEl}</animated.div>
        </div>
        <div className={s.content}>
          <div className={s.title}>{title}</div>
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
