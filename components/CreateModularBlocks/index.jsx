import cn from 'classnames';
import UIChrome from 'components/UiChrome';
import { useEffect, useState } from 'react';
import s from './style.module.css';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const allBlocks = ['Text', 'Gallery', 'Quote', 'Call to action'];

export default function CreateModularBlocks() {
  const [blockCount, setBlockCount] = useState(-1);

  useEffect(() => {
    let stopped = false;

    (async () => {
      while (!stopped) {
        for (let x = 0; x < allBlocks.length; x++) {
          await wait(100);
          if (!stopped) {
            setBlockCount((i) => i + 1);
          }
        }
        await wait(800);
        if (!stopped) {
          setBlockCount(-1);
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
        <div className={s.title}>Edit &quot;Blog post&quot; model</div>

        <div className={s.field}>
          <div className={s.fieldInner}>
            <div className={s.fieldDrag} />
            <div className={s.fieldBox}>
              <div className={s.fieldName}>Title</div>
              <div className={s.fieldType}>string</div>
            </div>
          </div>
        </div>

        <div className={s.field}>
          <div className={s.fieldInner}>
            <div className={s.fieldDrag} />
            <div className={s.fieldBox}>
              <div className={s.fieldName}>Author</div>
              <div className={s.fieldType}>1-N relationship</div>
            </div>
          </div>
        </div>

        <div className={s.field}>
          <div className={s.fieldInner}>
            <div className={s.fieldDrag} />
            <div className={s.fieldBox}>
              <div className={s.fieldName}>Content</div>
              <div className={s.fieldType}>modular content</div>
            </div>
          </div>
          <div className={s.blocks}>
            {allBlocks.map((block, i) => (
              <div
                className={cn(s.fieldInner, {
                  [s.fieldInnerHidden]: i > blockCount,
                })}
                key={block}
              >
                <div className={s.fieldDrag} />
                <div className={s.fieldBox}>
                  <div className={s.fieldName}>{block}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UIChrome>
  );
}
