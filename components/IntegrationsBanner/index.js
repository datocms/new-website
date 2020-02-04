import s from './style.css';
import Wrapper from 'components/Wrapper';

export default function IntegrationsBanner({ title, children }) {
  return (
    <div className={s.root}>
      <div className={s.background}>
        <div className={s.backgroundInner}> 
          <div className={s.backgroundImage} />
        </div>
      </div>
      <div className={s.foreground}>
        <Wrapper>
          <div className={s.body}>
            <div className={s.title}>{title}</div>
            <div className={s.content}>{children}</div>
          </div>
        </Wrapper>
      </div>
    </div>
  );
}
