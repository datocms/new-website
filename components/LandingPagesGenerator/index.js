import UIChrome from 'components/UiChrome';
import s from './style.module.css';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useTransition, animated } from 'react-spring';

const shuffle = array => {
  return [...array].sort(() => Math.random() - 0.5);
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

export default function UseModularBlocks() {
  const [rows, set] = useState(blocks);
  useEffect(() => void setInterval(() => set(shuffle), 2000), []);

  let height = 0;
  const transitions = useTransition(
    rows.map(data => ({ ...data, y: (height += data.height) - data.height })),
    d => d.name,
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
                transform: y.interpolate(y => `translate3d(0,${y}px,0)`),
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
