import s from './style.css';
import Wrapper from 'components/Wrapper';
import cn from 'classnames';
import LazyImage from 'components/LazyImage';

import Website from 'public/images/illustrations/website.svg';
import Chatbot from 'public/images/illustrations/chatbot.svg';
import Mobile from 'public/images/illustrations/mobile.svg';
import VoiceAssistant from 'public/images/illustrations/voice-assistant.svg';
import Store from 'public/images/illustrations/store.svg';

import GraphQl from 'public/images/illustrations/graphql-api.svg';
import Image from 'public/images/illustrations/image-api.svg';
import Video from 'public/images/illustrations/video-encoding.svg';
import Backend from 'public/images/illustrations/content-editors2.svg';

const apps = [
  { id: 'Website', Icon: Website },
  { id: 'Chatbot', Icon: Chatbot },
  { id: 'Mobile app', Icon: Mobile },
];

const people = [
  { role: 'Developer', image: 'p2.png' },
  { role: 'Marketer', image: 'p3.png' },
  { role: 'Copywriter', image: 'p5.png' },
];

export default function OmnichannelIllustration() {
  return (
    <div className={s.root}>
      <Wrapper>
        <div className={s.inner}>
          <div className={s.backend}>
            <div className={s.backendInner}>
              <Backend />
              <div className={s.backendTitle}>Backend for editors</div>
              <div className={s.features}>
                <div className={s.feature}>Centralized hub</div>
                <div className={s.feature}>Fully customizable schema</div>
                <div className={s.feature}>Extensible interface</div>
              </div>
            </div>
          </div>
          <div className={s.center}>
            <svg
              viewBox="0 0 100 267"
              preserveAspectRatio="none"
              className={cn(s.lines, s.linesH)}
            >
              <g>
                <path
                  d="M89,113 C89,52.3093004 11,81.2309828 11,15"
                  transform="translate(50.000000, 64.000000) rotate(-90.000000) translate(-50.000000, -64.000000) "
                ></path>
                <path
                  d="M89,252 C89,191.3093 11,220.230983 11,154"
                  transform="translate(50.000000, 203.000000) scale(1, -1) rotate(-90.000000) translate(-50.000000, -203.000000) "
                ></path>
                <line x1="99.6357046" y1="134" x2="1" y2="133.5"></line>
              </g>
            </svg>
          </div>
          <div className={s.apis}>
            <div className={s.api}>
              <GraphQl /> GraphQL Content API
            </div>
            <div className={s.api}>
              <Image /> Images API
            </div>
            <div className={s.api}>
              <Video /> Video streaming API
            </div>
          </div>
          <div className={s.linesVContainer}>
            <svg viewBox="0 0 357 86" className={cn(s.lines, s.linesV)}>
              <g>
                <line
                  x1="178.5"
                  y1="85.5"
                  x2="178.5"
                  y2="0.5"
                  transform="translate(178.500000, 43.000000) scale(1, -1) translate(-178.500000, -43.000000) "
                ></line>
                <path
                  d="M2.5,1 C87.5,1 2.9006892,85 87.5,85"
                  transform="translate(45.000000, 43.000000) scale(-1, -1) rotate(-90.000000) translate(-45.000000, -43.000000) "
                ></path>

                <path
                  d="M354.5,85 C269.900689,85 354.5,1 269.5,1"
                  transform="translate(312.000000, 43.000000) scale(-1, 1) rotate(-90.000000) translate(-312.000000, -43.000000) "
                ></path>
              </g>
            </svg>
          </div>
          <div />
          <div className={s.linesVContainer}>
            <svg viewBox="0 0 357 86" className={cn(s.lines, s.linesV)}>
              <g>
                <line
                  x1="178.5"
                  y1="0.5"
                  x2="178.5"
                  y2="85.5"
                  transform="translate(178.500000, 43.000000) scale(1, -1) translate(-178.500000, -43.000000) "
                ></line>
                <path
                  d="M87.5,85 C2.9006892,85 87.5,1 2.5,1"
                  transform="translate(45.000000, 43.000000) scale(-1, -1) rotate(-90.000000) translate(-45.000000, -43.000000) "
                ></path>
                <path
                  d="M269.5,1 C354.5,1 269.900689,85 354.5,85"
                  transform="translate(312.000000, 43.000000) scale(-1, 1) rotate(-90.000000) translate(-312.000000, -43.000000) "
                ></path>
              </g>
            </svg>
          </div>
          <div>
            <div className={s.people}>
              {people.map(person => (
                <div className={s.person} key={person.name}>
                  <div className={s.personIcon}>
                    <LazyImage src={`/images/faces/${person.image}`} />
                  </div>
                  <div className={s.personRole}>{person.role}</div>
                </div>
              ))}
            </div>
          </div>
          <div />
          <div>
            <div className={s.apps}>
              {apps.map(app => (
                <div className={s.app} key={app.id}>
                  <div className={s.appIcon}>
                    <app.Icon preserveAspectRatio="meet" />
                  </div>
                  <div className={s.appLabel}>{app.id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
