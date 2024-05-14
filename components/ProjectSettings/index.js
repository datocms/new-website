import UIChrome from 'components/UiChrome';
import s from './style.module.css';
import { useEffect, useState } from 'react';
import cn from 'classnames';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const locales = [
  'English (en-US)',
  'Spanish (es)',
  'Italian (it)',
  'French (fr)',
  'Chinese (ch)',
];

export default function ProjectSettings() {
  const [blockCount, setBlockCount] = useState(0);

  useEffect(() => {
    let stopped = false;

    (async () => {
      while (!stopped) {
        for (let x = 1; x < 5; x++) {
          await wait(200);
          if (!stopped) {
            setBlockCount((i) => i + 1);
          }
        }
        await wait(800);
        if (!stopped) {
          setBlockCount(0);
        }
        await wait(500);
      }
    })();

    return () => {
      stopped = true;
    };
  }, []);

  return (
    <UIChrome>
      <div className={s.body}>
        <div className={s.title}>Project settings</div>
        <div className={s.box}>
          <div className={s.field}>
            <div className={s.label}>Languages</div>
            <div className={s.multiInput}>
              {locales.map((locale, i) => (
                <div
                  className={cn(s.multiInputVal, {
                    [s.multiInputValHidden]: i > blockCount,
                  })}
                  key={locale}
                >
                  {locale}
                </div>
              ))}
            </div>
          </div>
          <div className={s.field}>
            <div className={s.label}>Timezone</div>
            <div className={s.singleInput}>(GMT+01:00) London</div>
          </div>
          <div className={s.button}>Save settings</div>
        </div>{' '}
      </div>
    </UIChrome>
  );
}
