import UIChrome from 'components/UiChrome';
import s from './style.css';

export default function ProjectSettings({ bubbles, ...other }) {
  return (
    <UIChrome>
      <div className={s.body}>
        <div className={s.title}>Project settings</div>
        <div className={s.box}>
          <div className={s.field}>
            <div className={s.label}>Languages</div>
            <div className={s.multiInput}>
              <div className={s.multiInputVal}>English (en-US)</div>
              <div className={s.multiInputVal}>Spanish (es)</div>
              <div className={s.multiInputVal}>Italian (it)</div>
              <div className={s.multiInputVal}>French (fr)</div>
              <div className={s.multiInputVal}>Chinese (ch)</div>
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
