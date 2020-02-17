import Wrapper from "components/Wrapper";
import s from "./style.css";

export default function Numbers({ children }) {
  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.rootInner}>
          <div className={s.rootBlocks}>{children}</div>
        </div>
      </Wrapper>
    </div>
  );
}

export function Block({ image, title, children, logo: Logo }) {
  return (
    <div className={s.block}>
      {image}
      <div className={s.blockTitle}>{title}</div>
      {children}
      {Logo && <Logo preserveAspectRatio="meet" className={s.logo} />}
    </div>
  );
}
