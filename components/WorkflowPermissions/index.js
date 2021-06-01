import UIChrome from 'components/UiChrome';
import s from './style.module.css';
import cn from 'classnames';
import { useEffect, useState } from 'react';

export default function FieldSettings() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setOn((on) => !on), 1000);
    () => clearInterval(interval);
  }, []);

  return (
    <UIChrome>
      <div className={s.body}>
        <div className={s.title}>What Creators can do:</div>

        <div className={s.field}>
          Can <strong>create</strong> new <strong>Articles</strong>
        </div>

        <div className={s.field}>
          Can move new <strong>Articles</strong> from <strong>Draft</strong>{' '}
          stage to <strong>In review</strong>
        </div>

        <div className={s.field}>
          Can publish <strong>Articles</strong> in <strong>Approved</strong>{' '}
          stage
        </div>

        <div className={s.button}>Save settings</div>
      </div>
    </UIChrome>
  );
}
