import Wrapper from "components/Wrapper";
import s from "./style.css";

export default function LogosBar({ title, clients }) {
  return (
    <Wrapper>
      {title && <div className={s.title}>{title}</div>}
      <div className={s.root}>
        {clients.map((Client, i) => (
          <div className={s.logo} key={i}>
            <Client />
          </div>
        ))}
      </div>
    </Wrapper>
  );
}
