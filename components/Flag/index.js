import Wrapper from 'components/Wrapper';
import styles from './style.css';
import { animated, useSpring } from 'react-spring';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { useRef, useState } from 'react';
import LazyImage from 'components/LazyImage';
import clamp from 'clamp';

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
      <LazyImage src={`images/illustrations/${image}.svg`} />
    ) : (
      image ? React.createElement(image) : <span />
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
      <div ref={elementRef} className={styles.root}>
        <div className={styles.imageContainer}>
          <animated.div
            className={styles[`${style}Dot`]}
            style={{
              ...dotAnimStyle,
              left: `${x}%`,
              top: `${y}%`,
              height: `${size}vh`,
              width: `${size}vh`,
            }}
          />
          <animated.div className={styles.image}>
            {imageEl}
          </animated.div>
        </div>
        <div className={styles.content}>
          <div className={styles.title}>{title}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
          <div className={styles.body}>{children}</div>
        </div>
      </div>
    </Wrapper>
  );
}

export function Highlight({ style = 'good', children }) {
  return <strong className={styles[`${style}Highlight`]}>{children}</strong>;
}
