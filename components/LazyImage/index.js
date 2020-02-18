import React from 'react';
import { useInView } from 'react-intersection-observer';

export default function LazyImage(props) {
  const [ref, inView] = useInView({
    threshold: 0,
    rootMargin: '300px 300px 300px 300px',
    triggerOnce: true,
  });

  return inView ? <img {...props} /> : <span ref={ref} />;
}
