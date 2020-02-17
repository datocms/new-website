import Wrapper from "components/Wrapper";
import s from "./style.css";

export default function Numbers({ children, image }) {
  return (
    <div className={s.root}>
      <div className={s.image} style={{ backgroundImage: `url(${image})` }} />
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
