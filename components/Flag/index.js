import Wrapper from 'components/Wrapper';
import s from './style.module.css';
// import { animated, useSpring } from 'react-spring';
// import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { useRef, useState } from 'react';
import LazyImage from 'components/LazyImage';
// import clamp from 'clamp';
import cn from 'classnames';
// import { useInView } from 'react-intersection-observer';

export default function Flag({
  style = 'neutral',
  title,
  subtitle,
  image,
  children,
}) {
  const [size] = useState(Math.random() * 1.5 + 2);
  const [x] = useState(Math.floor(Math.random() * 30));
  const [y] = useState(Math.floor(Math.random() * 30) + 20);

  // const elementRef = useRef(null);

  // const [dotAnimStyle, setDotAnimStyle] = useSpring(() => ({
  //   transform: 'perspective(500px) rotateX(0deg) translateZ(-500px)',
  // }));

  const imageEl =
    typeof image === 'string' ? (
      <LazyImage src={`/images/illustrations/${image}.svg`} />
    ) : image ? (
      React.createElement(image)
    ) : (
      <span />
    );

  // const [ref, inView] = useInView({
  //   threshold: 0,
  //   rootMargin: '300px 300px 300px 300px',
  //   triggerOnce: true,
  // });

  // useScrollPosition(
  //   ({ prevPos, currPos }) => {
  //     const rotation = clamp((prevPos.y - currPos.y) / 2, -10, 10);

  //     if (inView) {
  //       setDotAnimStyle({
  //         transform: `perspective(500px) rotateX(${rotation}deg) translateZ(-500px)`,
  //       });
  //     }
  //   },
  //   [],
  //   elementRef,
  //   false,
  // );

  return (
    <Wrapper>
      <div className={cn(s.root, s[`${style}Root`])}>
        <div className={s.imageContainer}>
          <div
            className={s[`${style}Dot`]}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              height: `calc(var(--dotBaseUnit) * ${size})`,
              width: `calc(var(--dotBaseUnit) * ${size})`,
            }}
          />
          <div className={s.image}>{imageEl}</div>
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
