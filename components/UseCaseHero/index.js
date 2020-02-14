import Wrapper from 'components/Wrapper';
import s from './style.css';
import { useSpring, animated } from 'react-spring';
import { useCallback, useEffect } from 'react';

const calc = (x, y) => [
  (x - window.innerWidth / 2) / (window.innerWidth / 2),
  (y - window.innerHeight / 2) / (window.innerHeight / 2),
];

const trans = (x, y) =>
  `translateY(-50%) perspective(400px) rotateY(${x * 4}deg) rotateX(${y *
    -4}deg)`;

export default function UseCase({ title, subtitle, image, gradient }) {
  const [props, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 10, tension: 550, friction: 140 },
  }));

  const handleMouseMove = useCallback(({ pageX: x, pageY: y }) => {
    console.log(calc(x, y));
    set({ xy: calc(x, y) });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className={s.hero} style={{ background: `linear-gradient(45deg, ${gradient[0]}, ${gradient[1]})`}}>
      <Wrapper>
        <div className={s.heroInner}>
          <div className={s.heroBody}>
            <div className={s.heroKicker}>Customer success story</div>
            <div className={s.heroTitle}>{title}</div>
            <div className={s.heroSubtitle}>
              {subtitle}
            </div>
          </div>
          <animated.img
            className={s.image}
            style={{ transform: props.xy.interpolate(trans) }}
            src={image}
          />
        </div>
      </Wrapper>
    </div>
  );
}
