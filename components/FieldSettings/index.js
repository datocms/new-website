import UIChrome from 'components/UiChrome';
import s from './style.module.css';
import cn from 'classnames';
import { useEffect, useState } from 'react';

export default function FieldSettings() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setOn(on => !on), 1000);
    () => clearInterval(interval);
  }, []);

  return (
    <UIChrome>
      <div className={s.body}>
        <div className={s.title}>Edit field</div>
        <div className={s.box}>
          <div className={s.field}>
            <div className={s.label}>Name</div>
            <div className={s.input}>Title</div>
          </div>
          <div className={s.field}>
            <div className={s.label}>API Key</div>
            <div className={s.input}>title</div>
          </div>
          <div className={s.bool}>
            <div className={cn(s.switch, { [s.switchOn]: on })} />
            <div className={s.label}>Enable localization for this field?</div>
          </div>

          <div className={cn(s.bool, { [s.boolDisabled]: !on })}>
            <div className={s.switch} />
            <div className={s.label}>Require all locales?</div>
          </div>

          <div className={s.button}>Save settings</div>
        </div>
      </div>
    </UIChrome>
  );
}
