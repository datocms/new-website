import { useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import times from 'utils/times';
import s from './style.module.css';

function Coso({ title, children, hidden, modified }) {
  return (
    <div className={s.dataWrapper}>
      <div
        className={s.data}
        style={{
          visibility: hidden ? 'hidden' : 'visible',
          color: modified ? 'var(--azure-color)' : null,
        }}
      >
        <div>
          {modified ? 'Modified content schema' : 'Current content schema'}
        </div>
      </div>

      {title && <div className={s.dataTitle}>{title}</div>}

      {children}
    </div>
  );
}

const Browser = ({ children }) => {
  return (
    <div className={s.window}>
      <div className={s.windowBar}>
        <div />
      </div>
      <div className={s.browserBar}>
        <div className={s.addressBar} />
      </div>
      {children}
    </div>
  );
};

const steps = [
  'Make changes to schema',
  'Safely test changes',
  'When everything is ready...',
  'Switch environments!',
];

export default function Demo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((step) => (step + 1) % 10);
    }, 1500);

    return () => clearInterval(interval);
  }, [setStep]);

  return (
    <div className={s.bar}>
      <div className={s.foo}>
        <Coso title="Primary environment" hidden={step >= 6}>
          <svg className={s.line} viewBox="0 0 3 30">
            <line x1="0" y1="30" x2="0" y2="0" />
          </svg>
          <Browser>
            <div className={s.livePage}>Your live website</div>
          </Browser>
        </Coso>

        {step >= 1 && (
          <>
            <div className={s.move1}>
              <Coso title="Sandbox environment" />
            </div>
            <div className={s.cloneDataContainer}>
              <Coso
                title={step < 6 ? 'Sandbox environment' : 'Backup environment'}
                hidden={step >= 6}
                modified={step >= 3}
              >
                <TransitionGroup className={s.steps}>
                  {step < 7 &&
                    times(Math.min(step - 1, steps.length)).map((i) => (
                      <CSSTransition
                        key={i}
                        classNames={{
                          enter: s.stepEnter,
                          enterActive: s.stepEnterActive,
                          exit: s.stepLeave,
                          exitActive: s.stepLeaveActive,
                        }}
                        timeout={1400}
                      >
                        <div className={s.migrationStep}>{steps[i]}</div>
                      </CSSTransition>
                    ))}
                </TransitionGroup>
              </Coso>
            </div>
          </>
        )}
        {step >= 6 && (
          <div className={s.move2}>
            <Coso />
          </div>
        )}
        {step >= 6 && (
          <div className={s.move3}>
            <Coso modified />
          </div>
        )}
      </div>
    </div>
  );
}
