import Wrapper from 'components/Wrapper'
import s from "./style.css";

export default function Quote({ quote, author }) {
  return (
    <Wrapper>
    <div className={s.root}>
      <div className={s.quote}>{quote}</div>
      <div className={s.author}>{author}</div>
    </div>
    </Wrapper>

  );
}
