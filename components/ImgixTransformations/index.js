import { useRef, useState, useEffect, useCallback } from 'react';
import Wrapper from 'components/Wrapper';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import s from './style.css';

function Param({ param }) {
  const [key, value] = param.split(/=/);

  return (
    <span>
      {key}=
      <span className={s.paramValueContainer}>
        <ReactCSSTransitionGroup
          transitionName={{
            enter: s.valueAnimationEnter,
            enterActive: s.valueAnimationEnterActive,
            leave: s.valueAnimationLeave,
            leaveActive: s.valueAnimationLeaveActive,
          }}
          transitionEnterTimeout={250}
          transitionLeaveTimeout={250}
        >
          <span key={value} className={s.paramValue}>
            {value}
          </span>
        </ReactCSSTransitionGroup>
      </span>
    </span>
  );
}

const steps = [
  {
    transforms: ['auto=compress'],
    result: {
      width: 1.0,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(0.0%, 0.0%)',
    },
  },
  {
    transforms: ['auto=compress', 'fit=clamp'],
    result: {
      width: 1.0,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(0.0%, 0.0%)',
    },
  },
  {
    transforms: ['auto=compress', 'fit=clamp', 'w=900'],
    result: {
      width: 0.75,
      height: 0.75,
      transform: 'scaleX(0.75) scaleY(0.75) translate(0.0%, 0.0%)',
    },
  },
  {
    transforms: ['auto=compress', 'fit=crop', 'w=900'],
    result: {
      width: 0.75,
      height: 0.75,
      transform: 'scaleX(0.75) scaleY(0.75) translate(0.0%, 0.0%)',
    },
  },
  {
    transforms: ['auto=compress', 'fit=crop', 'w=900', 'h=400'],
    result: {
      width: 0.75,
      height: 0.53,
      transform: 'scaleX(0.75) scaleY(0.75) translate(0.0%, -11.08%)',
    },
  },
  {
    transforms: ['auto=compress', 'fit=crop', 'w=900', 'h=900'],
    result: {
      width: 0.75,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(-12.5%, 0.0%)',
    },
  },
  {
    transforms: ['auto=compress', 'fit=crop', 'w=900', 'h=900', 'crop=left'],
    result: {
      width: 0.75,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(0.0%, 0.0%)',
    },
  },
  {
    transforms: ['auto=compress', 'fit=crop', 'w=900', 'h=900', 'crop=right'],
    result: {
      width: 0.75,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(-25.0%, 0.0%)',
    },
  },
  {
    transforms: [
      'auto=compress',
      'fit=crop',
      'w=900',
      'h=900',
      'crop=right',
      'sepia=80',
    ],
    result: {
      width: 0.75,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(-25.0%, 0.0%)',
    },
  },
  {
    transforms: [
      'auto=compress',
      'fit=crop',
      'w=900',
      'h=900',
      'crop=right',
      'blur=30',
    ],
    result: {
      width: 0.75,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(-25.0%, 0.0%)',
    },
  },
  {
    transforms: [
      'auto=compress',
      'fit=crop',
      'w=900',
      'h=900',
      'crop=right',
      'htn=10',
    ],
    result: {
      width: 0.75,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(-25.0%, 0.0%)',
    },
  },
  {
    transforms: [
      'auto=compress',
      'fit=crop',
      'w=900',
      'h=900',
      'crop=right',
      'duotone=000080,FA8072',
    ],
    result: {
      width: 0.75,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(-25.0%, 0.0%)',
    },
  },
  {
    transforms: [
      'auto=compress',
      'fit=crop',
      'w=900',
      'h=900',
      'crop=right',
      'fm=jpg',
    ],
    result: {
      width: 0.75,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(-25.0%, 0.0%)',
    },
  },
  {
    transforms: [
      'auto=compress',
      'fit=crop',
      'w=900',
      'h=900',
      'crop=right',
      'fm=jpg',
      'q=75',
    ],
    result: {
      width: 0.75,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(-25.0%, 0.0%)',
    },
  },
  {
    transforms: [
      'auto=compress',
      'fit=crop',
      'w=900',
      'h=900',
      'crop=right',
      'fm=jpg',
      'q=90',
    ],
    result: {
      width: 0.75,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(-25.0%, 0.0%)',
    },
  },
  {
    transforms: [
      'auto=compress',
      'fit=crop',
      'w=900',
      'h=900',
      'crop=right',
      'fm=webp',
    ],
    result: {
      width: 0.75,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(-25.0%, 0.0%)',
    },
  },
];

const stepTime = 1500;
const width = 1200;
const height = 757;
const ar = width / height;
const url = 'https://assets.imgix.net/hp/snowshoe.jpg?w=1000';

export default function InterstitialTitle() {
  const ref = useRef([]);

  const [image, setImage] = useState(url);
  const [params, setParams] = useState([]);
  const [result, setResult] = useState({
    width: `calc(50vw * ${width})`,
    height: `calc(50vw / ${ar} * ${width})`,
    transform: 'scale(1)',
  });

  const reset = useCallback(() => {
    ref.current.map(clearTimeout);
    for (let i = 0; i < steps.length; i++) {

      const colorTransform = steps[i].transforms.find(t =>
        t.match(/(sepia|duotone|blur|htn)/),
      );

      const stepImage = url + (colorTransform ? `&${colorTransform}` : '');

      new Image(stepImage);

      ref.current.push(
        setTimeout(() => {
          setTimeout(() => setImage(stepImage), 700);
          setParams(steps[i].transforms);
          setResult(steps[i].result);
        }, i * stepTime),
      );
    }
  }, []);

  useEffect(() => {
    reset();
    setInterval(reset, steps.length * stepTime);
  }, []);

  return (
    <Wrapper>
      <div className={s.root}>
        <div
          className={s.imageFrame}
          style={{
            width: `calc(50vw * ${result.width})`,
            height: `calc(50vw / ${ar} * ${result.height})`,
          }}
        >
          <div
            className={s.imageInner}
            style={{
              width: `calc(50vw)`,
              height: `calc(50vw / ${ar})`,
              transform: result.transform,
            }}
          >
            <ReactCSSTransitionGroup
              transitionName={{
                enter: s.imageAnimationEnter,
                enterActive: s.imageAnimationEnterActive,
                leave: s.imageAnimationLeave,
                leaveActive: s.imageAnimationLeaveActive,
              }}
              transitionEnterTimeout={250}
              transitionLeaveTimeout={250}
            >
              <img key={image} src={image} />
            </ReactCSSTransitionGroup>
          </div>
        </div>

        <div className={s.params}>
          <ReactCSSTransitionGroup
            transitionName={{
              enter: s.paramAnimationEnter,
              enterActive: s.paramAnimationEnterActive,
              leave: s.paramAnimationLeave,
              leaveActive: s.paramAnimationLeaveActive,
            }}
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}
          >
            {params.map(param => (
              <div className={s.paramContainer} key={param.split(/=/)[0]}>
                <Param param={param} />
              </div>
            ))}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    </Wrapper>
  );
}
