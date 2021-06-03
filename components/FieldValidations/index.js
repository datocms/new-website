import UIChrome from 'components/UiChrome';
import cn from 'classnames';
import s from './style.module.css';
import { useEffect, useState } from 'react';

export default function FieldValidations() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCount((count) => (count + 1) % 5),
      1000,
    );
    () => clearInterval(interval);
  }, [setCount]);

  return (
    <UIChrome>
      <div className={s.body}>
        <div className={s.title}>Cover Image field validations</div>
        <div className={s.validations}>
          <div className={s.validation}>
            <div className={s.validationCheck}>
              <input type="checkbox" readOnly checked={count >= 0} />
            </div>
            <div className={s.validationBody}>
              <div className={s.validationLabel}>Required</div>
              <div className={s.validationHint}>
                You won't be able to save or publish a record if this field is
                empty
              </div>
            </div>
          </div>
          <div className={s.validation}>
            <div className={s.validationCheck}>
              <input type="checkbox" readOnly checked={count >= 1} />
            </div>
            <div className={s.validationBody}>
              <div className={s.validationLabel}>
                Accept only specified file size
              </div>
              <div className={s.validationHint}>
                Specify a minimum and/or maximum allowed file size
              </div>

              <div
                className={cn(s.validationOptions, {
                  [s.validationOptionsActive]: count >= 1,
                })}
              >
                <div className={s.dropdown}>No more than</div>{' '}
                <input type="text" readOnly disabled value="20" />
                MB
              </div>
            </div>
          </div>
          <div className={s.validation}>
            <div className={s.validationCheck}>
              <input type="checkbox" readOnly checked={count >= 2} />
            </div>
            <div className={s.validationBody}>
              <div className={s.validationLabel}>
                Accept only specified extensions
              </div>
              <div className={s.validationHint}>
                You won't be able to save or publish a record if the file
                doesn't end with one the specified values
              </div>

              <div
                className={cn(s.validationOptions, {
                  [s.validationOptionsActive]: count >= 2,
                })}
              >
                <div className={s.dropdown}>Image (JPG, PNG, GIF)</div>
              </div>
            </div>
          </div>
          <div className={s.validation}>
            <div className={s.validationCheck}>
              <input type="checkbox" readOnly checked={count >= 3} />
            </div>
            <div className={s.validationBody}>
              <div className={s.validationLabel}>
                Accept only specified image dimensions
              </div>
              <div className={s.validationHint}>
                Specify a minimum and/or maximum width and height for images
              </div>

              <div
                className={cn(s.validationOptions, {
                  [s.validationOptionsActive]: count >= 3,
                })}
              >
                <div className={s.dropdown}>At least</div>{' '}
                <input type="text" readOnly disabled value="1024" /> x{' '}
                <input type="text" readOnly disabled value="768" />
                px
              </div>
            </div>
          </div>
          <div className={s.validation}>
            <div className={s.validationCheck}>
              <input type="checkbox" readOnly checked={count >= 4} />
            </div>
            <div className={s.validationBody}>
              <div className={s.validationLabel}>Require alt and/or title</div>
              <div className={s.validationHint}>
                Specify which image metadata has to be present
              </div>
            </div>
          </div>
        </div>

        <div className={s.button}>Save settings</div>
      </div>
    </UIChrome>
  );
}
