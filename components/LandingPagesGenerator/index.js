import UIChrome from 'components/UiChrome';
import s from './style.module.css';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useTransition, animated } from 'react-spring';

const shuffle = (array) => {
  const currentId = array.map((i) => i.name).join('-');
  do {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    const shuffledId = shuffled.map((i) => i.name).join('-');

    if (shuffledId !== currentId) {
      return shuffled;
    }
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

export default function UseModularBlocks() {
  const [rows, set] = useState(blocks);
  useEffect(() => void setInterval(() => set(shuffle), 800), []);

  let height = 0;

  const transitions = useTransition(
    rows.map((data) => ({ ...data, y: (height += data.height) - data.height })),
    (d) => d.name,
    {
      from: { height: 0, opacity: 0 },
      leave: { height: 0, opacity: 0 },
      enter: ({ y, height }) => ({ y, height, opacity: 1 }),
      update: ({ y, height }) => ({ y, height }),
    },
  );

  // rows.forEach((row) => {
  //   row.y = height;
  //   height += row.height;
  // });

  // const transitions = useTransition(rows, {
  //   from: { height: 0, opacity: 0 },
  //   leave: { height: 0, opacity: 0 },
  //   enter: ({ y, height }) => ({ y, height, opacity: 1 }),
  //   update: ({ y, height }) => ({ y, height }),
  // });

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
          {/* {transitions((style, item) => (
            <animated.div className={s.card} style={style}>
              <div className={s.cell}>
                <div
                  className={s.details}
                  style={{ backgroundImage: item.css }}
                />
              </div>
            </animated.div>
          ))} */}
        </div>
      </div>
    </UIChrome>
  );
}
