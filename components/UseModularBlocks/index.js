import UIChrome from 'components/UiChrome';
import s from './style.css';
import cn from 'classnames';
import { useEffect, useState } from 'react';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const labels = { text: 'Text', gallery: 'Gallery', quote: 'Quote', calltoaction: 'Call to action'};
const allBlocks = ['text', 'gallery', 'quote', 'calltoaction'];
const blocksSequence = ['text', 'gallery', 'text', 'calltoaction', 'quote'];

const blocksContent = {
  text: (
    <>
      <div className={s.field}>
        <div className={s.label}>Text</div>
        <div className={s.textarea}>Lorem ipsum....</div>
      </div>
    </>
  ),
  gallery: (
    <>
      <div className={s.field}>
        <div className={s.label}>Gallery</div>
        <div className={s.gallery}>
          <div className={s.galleryPhoto} />
          <div className={s.galleryPhoto} />
          <div className={s.galleryPhoto} />
        </div>
      </div>
    </>
  ),
  calltoaction: (
    <>
      <div className={s.field}>
        <div className={s.label}>CTA label</div>
        <div className={s.input}>Try it now!</div>
      </div>
      <div className={s.field}>
        <div className={s.label}>CTA URL</div>
        <div className={s.input}>http://...</div>
      </div>
    </>
  ),
  quote: (
    <>
      <div className={s.field}>
        <div className={s.label}>Quote</div>
        <div className={s.textarea}>Lorem ipsum....</div>
      </div>
      <div className={s.field}>
        <div className={s.label}>Author</div>
        <div className={s.input}>Steve Jobs</div>
      </div>
    </>
  )
}

export default function UseModularBlocks() {
  const [blockCount, setBlockCount] = useState(-1);

  useEffect(() => {
    (async () => {
      while (true) {
        const c = new Date();
        for (let x = 0; x <= blocksSequence.length; x++) {
          await wait(2500);
          setBlockCount(i => i + 1);
        }
        await wait(3500);
        setBlockCount(-1);
        console.log(new Date() - c);
      }
    })();
  }, []);

  return (
    <UIChrome>
      <div className={s.body}>
        <div className={s.bodyInner}>
          <div className={s.title}>Create new Blog post</div>
          <div className={s.box}>
            <div className={s.field}>
              <div className={s.label}>Title</div>
              <div className={s.input}>The Best Video Games to Play</div>
            </div>
            <div className={s.field}>
              <div className={s.label}>Author</div>
              <div className={s.input}>Dan Poe</div>
            </div>
            <div className={s.field}>
              <div className={s.label}>Content</div>
              {blocksSequence.map((block, i) => (
                <div className={cn(s.block, { [s[`block${block}`]]: true, [s.blockHidden]: i >= blockCount })} key={i}>
                  <div className={s.blockInner} key={i}>
                    {blocksContent[block]}
                  </div>
                </div>
              ))}
              <div className={s.mcAdd}>
                <div className={s.mcAddLabel}>Add a new block:</div>
                {allBlocks.map(block => (
                  <div className={cn(s.mcAddButton, { [s.mcAddButtonActive]: blocksSequence[blockCount] == block })} key={block}>
                    {labels[block]}
                  </div>
                ))}
              </div>
            </div>
            <div className={s.button}>Save Blog Post</div>
          </div>
        </div>
      </div>
    </UIChrome>
  );
}
