import UIChrome from 'components/UiChrome';
import { useEffect, useState } from 'react';
import { animated, useTransition } from 'react-spring';
import s from './style.module.css';

const shuffle = (array) => {
  const currentId = array.map((i) => i.name).join('-');
  do {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    const shuffledId = shuffled.map((i) => i.name).join('-');

    if (shuffledId !== currentId) {
      return shuffled;
    }
    // biome-ignore lint/correctness/noConstantCondition: <explanation>
  } while (true);
};

const blocks = [
  {
    name: 'text1',
    css: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    height: 150,
  },
  {
    name: 'text2',
    css: 'linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%)',
    height: 200,
  },
  {
    name: 'quote',
    css: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    height: 100,
  },
];

export default function LandingPagesGenerator() {
  const [rows, set] = useState(blocks);

  useEffect(() => {
    const interval = setInterval(() => set(shuffle), 800);
    return () => clearInterval(interval);
  }, []);

  let height = 0;

  const transitions = useTransition(
    rows.map((data) => {
      height += data.height;
      return { ...data, y: height - data.height };
    }),
    (d) => d.name,
    {
      from: { height: 0, opacity: 0 },
      leave: { height: 0, opacity: 0 },
      enter: ({ y, height }) => ({ y, height, opacity: 1 }),
      update: ({ y, height }) => ({ y, height }),
    },
  );

  return (
    <UIChrome>
      <div className={s.body}>
        <div className={s.title}>Acme Inc.</div>
        <div className={s.list} style={{ height }}>
          {transitions.map(({ item, props: { y, ...rest }, key }, index) => (
            <animated.div
              key={key}
              className={s.card}
              style={{
                zIndex: blocks.length - index,
                transform: y.interpolate((y) => `translate3d(0,${y}px,0)`),
                ...rest,
              }}
            >
              <div className={s.cell}>
                <div
                  className={s.details}
                  style={{ backgroundImage: item.css }}
                />
              </div>
            </animated.div>
          ))}
        </div>
      </div>
    </UIChrome>
  );
}
