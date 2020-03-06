import React from 'react';
import { useInView } from 'react-intersection-observer';
import cn from 'classnames';
import s from './style.module.css';

export default function LazyImage(props) {
  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: '300px 300px 300px 300px',
    triggerOnce: true,
  });

  return inView ? (
    <img {...props} className={cn(s.lazyImage, props.className)} />
  ) : (
    <span ref={ref} />
  );
}
