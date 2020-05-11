import { useRef, useState, useEffect, useCallback } from 'react';
import Wrapper from 'components/Wrapper';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import s from './style.module.css';

// task fux: :environment do
//   transforms = [
//     [{ auto: "compress" }],
//     [{ auto: "compress"}, {fit: "clamp"}],
//     [{ auto: "compress" }, {fit: "clamp"}, { w: 900 }],
//     [{ auto: "compress" }, {fit: "clamp"}, { rect: "200,100,550,450" }],
//     [{ auto: "compress" }],
//     [{ auto: "compress" }, {fit: "crop"}],
//     [{ auto: "compress" }, {fit: "crop"}, { w: 900 }, { h: 400 }],
//     [{ auto: "compress" }, {fit: "crop"}, { w: 600 }, { h: 600 }],
//     [{ auto: "compress" }, {fit: "crop"}, { w: 600 }, { h: 600 }, { mask: "ellipse" }],
//     [{ auto: "compress" }, {fit: "crop"}, { w: 700 }, { h: 600 }],
//     [{ auto: "compress" }, {fit: "crop"}, { w: 700 }, { h: 600 }, { crop: %w[left] }],
//     [{ auto: "compress" }, {fit: "crop"}, { w: 700 }, { h: 600 }, { crop: %w[right] }],
//     [{ auto: "compress" }],
//     [{ auto: "compress" }, { sepia: "80" }],
//     [{ auto: "compress" }, { blur: "30" }],
//     [{ auto: "compress" }, { duotone: %w[000080,FA8072] }],
//     [{ auto: "compress"}, {fm: "jpg" }],
//     [{ auto: "compress"}, {fm: "jpg" }, {q: "20" }],
//     [{ auto: "compress"}, {fm: "jpg" }, {q: "90" }],
//     [{ auto: "compress"}, {fm: "webp" }],
//   ]

//   res = transforms.map do |transform|
//     query_string = transform.reduce({}) do |acc, t|
//       acc.merge(t)
//     end

//     width = 1000
//     height = 631

//     calc = ImgixGeometry::Calculator.new(
//       width,
//       height,
//       query_string,
//     )

//     m = calc.transform

//     a = m[0, 0].to_f.round(2)
//     b = m[0, 1].to_f.round(2)
//     c = m[1, 0].to_f.round(2)
//     d = m[1, 1].to_f.round(2)
//     tx = (m[0, 2].to_f / width * 100).round(2)
//     ty = (m[1, 2].to_f / height * 100).round(2)

//     {
//       transforms: transform.map do |h|
//         k = h.keys.first
//         v = if h[k].is_a?(Array)
//               h[k].join(",")
//             else
//               h[k]
//             end

//         "#{k}=#{v}"
//       end,
//       result: {
//         width: (calc.new_canvas.width.to_f / width).round(2),
//         height: (calc.new_canvas.height.to_f / height).round(2),
//         transform: "scaleX(#{a}) scaleY(#{d}) translate(#{tx}%, #{ty}%)",
//       },
//     }
//   end

//   puts JSON.pretty_generate(res)
// end

function Param({ param, isFirst }) {
  const [key, value] = param.split(/=/);

  return (
    <span className={s.param}>
      <span className={s.paramEq}>{isFirst ? '?' : '&'}</span>
      <span className={s.paramName}>{key}</span>
      <span className={s.paramEq}>=</span>
      <TransitionGroup className={s.paramValueContainer}>
        <CSSTransition
          key={value}
          classNames={{
            enter: s.valueAnimationEnter,
            enterActive: s.valueAnimationEnterActive,
            exit: s.valueAnimationLeave,
            exitActive: s.valueAnimationLeaveActive,
          }}
          timeout={{ enter: 1200, exit: 1200 }}
        >
          <span style={{ width: `${value.length}ch` }} className={s.paramValue}>
            {value}
          </span>
        </CSSTransition>
      </TransitionGroup>
    </span>
  );
}

const steps = [
  {
    transforms: ['fit=clamp'],
    result: {
      width: 1.0,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(0.0%, 0.0%)',
    },
  },
  {
    transforms: ['fit=clamp', 'w=900'],
    result: {
      width: 0.9,
      height: 0.9,
      transform: 'scaleX(0.9) scaleY(0.9) translate(0.0%, 0.0%)',
    },
  },
  {
    transforms: ['fit=clamp', 'rect=200,100,550,450'],
    result: {
      width: 0.55,
      height: 0.71,
      transform: 'scaleX(1.0) scaleY(1.0) translate(-20.0%, -15.85%)',
    },
  },
  {
    transforms: ['auto=compress'],
    result: {
      width: 1.0,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(0.0%, 0.0%)',
    },
  },
  {
    transforms: ['fit=crop', 'w=900', 'h=400'],
    result: {
      width: 0.9,
      height: 0.63,
      transform: 'scaleX(0.9) scaleY(0.9) translate(0.0%, -13.3%)',
    },
  },
  {
    transforms: ['fit=crop', 'w=600', 'h=600'],
    result: {
      width: 0.6,
      height: 0.95,
      transform: 'scaleX(0.95) scaleY(0.95) translate(-17.54%, 0.0%)',
    },
  },
  {
    transforms: ['fit=crop', 'w=600', 'h=600', 'mask=ellipse'],
    result: {
      width: 0.6,
      height: 0.95,
      transform: 'scaleX(0.95) scaleY(0.95) translate(-17.54%, 0.0%)',
    },
  },
  {
    transforms: ['fit=crop', 'w=700', 'h=600'],
    result: {
      width: 0.7,
      height: 0.95,
      transform: 'scaleX(0.95) scaleY(0.95) translate(-12.54%, 0.0%)',
    },
  },
  {
    transforms: ['fit=crop', 'w=700', 'h=600', 'crop=left'],
    result: {
      width: 0.7,
      height: 0.95,
      transform: 'scaleX(0.95) scaleY(0.95) translate(0.0%, 0.0%)',
    },
  },
  {
    transforms: ['fit=crop', 'w=700', 'h=600', 'crop=right'],
    result: {
      width: 0.7,
      height: 0.95,
      transform: 'scaleX(0.95) scaleY(0.95) translate(-25.09%, 0.0%)',
    },
  },
  {
    transforms: [],
    result: {
      width: 1.0,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(0.0%, 0.0%)',
    },
  },
  {
    transforms: ['sepia=80'],
    result: {
      width: 1.0,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(0.0%, 0.0%)',
    },
  },
  {
    transforms: ['blur=30'],
    result: {
      width: 1.0,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(0.0%, 0.0%)',
    },
  },
  {
    transforms: ['duotone=000080,FA8072'],
    result: {
      width: 1.0,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(0.0%, 0.0%)',
    },
  },
  {
    transforms: ['fm=jpg'],
    result: {
      width: 1.0,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(0.0%, 0.0%)',
    },
  },
  {
    transforms: ['fm=jpg', 'q=90'],
    result: {
      width: 1.0,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(0.0%, 0.0%)',
    },
  },
  {
    transforms: ['fm=webp'],
    result: {
      width: 1.0,
      height: 1.0,
      transform: 'scaleX(1.0) scaleY(1.0) translate(0.0%, 0.0%)',
    },
  },
];

const stepTime = 2000;
const width = 1000;
const height = 631;
const ar = width / height;
const url = 'https://assets.imgix.net/hp/snowshoe.jpg?w=1000';

export default function InterstitialTitle() {
  const ref = useRef([]);

  const [image, setImage] = useState(url);
  const [ellipse, setEllipse] = useState(false);
  const [started, setStarted] = useState(false);
  const [params, setParams] = useState([]);
  const [result, setResult] = useState({
    width: `calc(var(--max-width) * ${width})`,
    height: `calc(var(--max-width) / ${ar} * ${width})`,
    transform: 'scale(1)',
  });

  const reset = useCallback(() => {
    ref.current.map(clearTimeout);

    for (let i = 0; i < steps.length; i++) {
      const colorTransform = steps[i].transforms.find((t) =>
        t.match(/(sepia|duotone|blur|htn)/),
      );

      const isEllipse = !!steps[i].transforms.find((t) => t.match(/mask/));

      const stepImage = url + (colorTransform ? `&${colorTransform}` : '');

      const img = new Image();
      img.src = stepImage;

      ref.current.push(
        setTimeout(() => {
          setImage(stepImage);
          setEllipse(isEllipse);
          setParams(steps[i].transforms);
          setResult(steps[i].result);
        }, i * stepTime),
      );
    }
  }, []);

  useEffect(() => {
    reset();
    setStarted(true);
    setInterval(reset, steps.length * stepTime);
  }, []);

  return (
    <Wrapper>
      <div
        className={s.root}
        style={{ height: `calc(var(--max-width) / ${ar})` }}
      >
        <div
          className={cn(s.imageFrame, {
            [s.withTransitions]: started,
            [s.ellipseFrame]: ellipse,
          })}
          style={{
            width: `calc(var(--max-width) * ${result.width})`,
            height: `calc(var(--max-width) / ${ar} * ${result.height})`,
          }}
        >
          <TransitionGroup>
            <CSSTransition
              key={image}
              classNames={{
                enter: s.imageAnimationEnter,
                enterActive: s.imageAnimationEnterActive,
                exit: s.imageAnimationLeave,
                exitActive: s.imageAnimationLeaveActive,
              }}
              timeout={{ enter: 1300, exit: 1800 }}
            >
              <img
                src={image}
                className={s.image}
                style={{
                  width: `calc(var(--max-width))`,
                  height: `calc(var(--max-width) / ${ar})`,
                  transform: result.transform,
                }}
              />
            </CSSTransition>
          </TransitionGroup>
        </div>

        <div className={s.params}>
          <TransitionGroup
            className={s.paramsInner}
            style={{
              '--content-length': `${40 + params.join('.').length}ch`,
            }}
          >
            <CSSTransition key="prefix" timeout={0}>
              <span className={s.paramEq}>
                https://datocms-assets.com/image.png
              </span>
            </CSSTransition>
            {params.map((param, i) => (
              <CSSTransition
                key={param.split(/=/)[0]}
                classNames={{
                  enter: s.paramAnimationEnter,
                  enterActive: s.paramAnimationEnterActive,
                  exit: s.paramAnimationLeave,
                  exitActive: s.paramAnimationLeaveActive,
                }}
                timeout={{ enter: 900, exit: 400 }}
              >
                <div
                  className={s.paramContainer}
                  style={{ '--content-length': `${param.length + 2}ch` }}
                >
                  <Param param={param} isFirst={i === 0} />
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      </div>
    </Wrapper>
  );
}
