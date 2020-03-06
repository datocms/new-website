import UIChrome from 'components/UiChrome';
import s from './style.module.css';
import cn from 'classnames';
import { useEffect, useState } from 'react';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const allBlocks = ['Text', 'Gallery', 'Quote', 'Call to action'];

export default function FieldSettings() {
  const [blockCount, setBlockCount] = useState(-1);

  useEffect(() => {
    (async () => {
      while (true) {
        for (let x = 0; x < allBlocks.length; x++) {
          await wait(100);
          setBlockCount(i => i + 1);
        }
        await wait(2000);
        setBlockCount(-1);
        await wait(500);
      }
    })();
  }, []);

  return (
    <UIChrome>
      <div className={s.body}>
        <div className={s.title}>Edit "Blog post" model</div>

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
