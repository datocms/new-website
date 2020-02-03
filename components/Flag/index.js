import Wrapper from 'components/Wrapper';
import styles from './style.css';
import { animated, useSpring } from "react-spring";
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { useRef, useState } from 'react';
import clamp from 'clamp';

export default function Flag({ style = "neutral", title, image: Image, children }) {
  const elementRef = useRef(null);

  const [dotAnimStyle, setDotAnimStyle] = useSpring(() => ({
    transform: "perspective(500px) rotateX(0deg) translateZ(-500px)"
  }));

  useScrollPosition(
    ({ prevPos, currPos }) => {
      const rotation = clamp((prevPos.y - currPos.y) / 2, -10, 10);

      setDotAnimStyle({
        transform: `perspective(500px) rotateX(${rotation}deg) translateZ(-500px)`
      });

    }, [], elementRef, false
  );

  return (
    <Wrapper>
      <div ref={elementRef} className={styles.root}>
        <div className={styles.imageContainer}>
          <animated.div className={styles[`${style}Dot`]} style={dotAnimStyle} />
          <animated.div className={styles.image}><Image preserveAspectRatio="xMinyMin meet" /></animated.div>
        </div>
        <div className={styles.content}>
          <div className={styles.title}>{title}</div>
          <div className={styles.body}>{children}</div>
        </div>
      </div>
    </Wrapper>
  );
}

export function Highlight({ style = "good", children }) {
  return <strong className={styles[`${style}Highlight`]}>{children}</strong>;
}