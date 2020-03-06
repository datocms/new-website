import Wrapper from 'components/Wrapper';
import s from './style.module.css';
import BackgroundImage from 'components/BackgroundImage';

export default function Numbers({ children, image }) {
  return (
    <div className={s.root}>
      <BackgroundImage
        className={s.image}
        src={`${image}?fit=max&format=auto`}
      />
      <div className={s.inner}>
        <Wrapper>
          <div className={s.rootBlocks}>
            <div className={s.rootBlocksInner}>
              <div className={s.title}>Biggest wins</div>
              {children}
            </div>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}

export function Block({ title, children }) {
  return (
    <div className={s.block}>
      <div className={s.blockTitle}>{title}</div>
      <div className={s.blockResult}>{children}</div>
    </div>
  );
}
