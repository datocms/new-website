import cn from 'classnames';
import LazyImage from 'components/LazyImage';
import { useEffect, useRef, useState } from 'react';
import Confetti from 'react-dom-confetti';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import times from 'utils/times';
import s from './style.module.css';

const stages = ['draft', 'review', 'changes', 'approved', 'published'];

const steps = [
  'draft',
  'review',
  'changes',
  'draft',
  'review',
  'approved',
  'published',
];

const labels = [
  '📝 Draft',
  '🕵️ In review',
  '🚨 Changes requested',
  '👌 Approved',
  '🎉 Published',
];

const copy = { name: 'Lana', role: 'Copywriter', image: 'p5.png' };
const editor = { name: 'Dennis', role: 'Editor', image: 'p1.png' };
const manager = { name: 'Barbara', role: 'Manager', image: 'p4.png' };

const transitions = [
  copy, // draft -> review
  editor, // review -> changes
  copy, // changes -> draft
  copy, // draft -> review
  editor, // review -> approved
  manager, // approved -> published
];

const speed = 1500;

const Workflow = () => {
  const refs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const articleRef = useRef(null);

  const [step, setStep] = useState(-1);
  const [transition, setTransition] = useState(0);

  useEffect(() => {
    if (step === -1) {
      return;
    }

    const stepStageIndex = stages.indexOf(steps[step]);
    const newRef = refs[stepStageIndex];
    articleRef.current.style.left = `${newRef.current.offsetLeft + 10}px`;
    articleRef.current.style.top = `${newRef.current.offsetTop + 10}px`;
    articleRef.current.style.width = `${newRef.current.offsetWidth}px`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    let stopped = false;

    setStep(0);

    const interval = setInterval(() => {
      setStep((step) => (step + 1) % steps.length);
      setTimeout(() => {
        if (!stopped) {
          setTransition((transition) => (transition + 1) % steps.length);
        }
      }, speed / 2);
    }, speed);

    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [setStep, setTransition]);

  return (
    <>
      <div className={s.grid}>
        {times(stages.length).map((i) => (
          <div
            key={stages[i]}
            className={cn(s.stage, s[stages[i]], {
              [s.activeStage]: stages[i] === steps[step],
            })}
          >
            {stages[i] === 'published' && (
              <div className={s.stageConfetti}>
                <Confetti
                  active={transition === 6}
                  config={{
                    angle: 90,
                    spread: 360,
                    startVelocity: 25,
                    elementCount: 50,
                    dragFriction: 0.12,
                    duration: 2000,
                    stagger: 3,
                    width: '8px',
                    height: '8px',
                    colors: [
                      '#a864fd',
                      '#29cdff',
                      '#78ff44',
                      '#ff718d',
                      '#fdff6a',
                    ],
                  }}
                />
              </div>
            )}
            <div className={s.stageLabel}>{labels[i]}</div>
            <div className={s.stageContainer} ref={refs[i]} />
          </div>
        ))}
      </div>
      <div
        className={cn(s.record, {
          [s.recordHidden]: !transitions[transition],
        })}
        ref={articleRef}
      >
        <div
          className={cn(s.recordBody, {
            [s.recordBodyChanged]: transition >= 3,
          })}
        >
          {transition >= 3 ? 'Changed article' : 'New article'}
        </div>
        <TransitionGroup className={s.personContainer}>
          {transitions[transition] && (
            <CSSTransition
              key={transitions[transition].name}
              classNames={{
                enter: s.personEnter,
                enterActive: s.personEnterActive,
                exit: s.personLeave,
                exitActive: s.personLeaveActive,
              }}
              timeout={{ enter: 200, exit: 200 }}
            >
              <div className={s.person}>
                <div className={s.personIcon}>
                  <LazyImage
                    src={`/images/faces/${transitions[transition].image}`}
                  />
                </div>
                <div>
                  <div className={s.personName}>
                    {transitions[transition].name}
                  </div>
                  <div className={s.personRole}>
                    {transitions[transition].role}
                  </div>
                </div>
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    </>
  );
};

export default Workflow;
