import s from './style.css';
import Wrapper from 'components/Wrapper';
import LazyImage from 'components/LazyImage';

import Website from 'public/images/illustrations/website.svg';
import Chatbot from 'public/images/illustrations/chatbot.svg';
import Mobile from 'public/images/illustrations/mobile.svg';
import VoiceAssistant from 'public/images/illustrations/voice-assistant.svg';
import Store from 'public/images/illustrations/store.svg';

import FullLogo from 'public/images/full_logo.svg';

const apps = [
  { id: 'Website', Icon: Website },
  { id: 'Chatbot', Icon: Chatbot },
  { id: 'Mobile', Icon: Mobile },
  { id: 'Alexa', Icon: VoiceAssistant },
  { id: 'Store', Icon: Store },
];

const people = [
  { name: 'Dennis', role: 'Programmer', image: 'p1.png' },
  { name: 'Anthony', role: 'Frontend developer', image: 'p2.png' },
  { name: 'Bradley', role: 'Marketer', image: 'p3.png' },
  { name: 'Barbara', role: 'Shop manager', image: 'p4.png' },
  { name: 'Lana', role: 'Copywriter', image: 'p5.png' },
];

export default function OmnichannelIllustration() {
  return (
    <div className={s.root}>
      <Wrapper>
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
        <div className={s.center}>
          <svg viewBox="-3 0 972 414" className={s.lines}>
            <g>
              <path
                d="M966.428837,158.667162 C865.928837,158.667162 814.428837,138.148235 814.428837,9.33283625"
                id="a5"
                transform="translate(890.428837, 83.999999) rotate(-90.000000) translate(-890.428837, -83.999999) "
              ></path>
              <path
                d="M623,10.084591 C623,76.596318 723.144,47.55204 723.144,108.5"
                id="a4"
                transform="translate(673.072000, 59.292295) scale(-1, 1) translate(-673.072000, -59.292295) "
              ></path>
              <line x1="483.5" y1="0" x2="483.5" y2="108.5" id="a3"></line>
              <path
                d="M236.376,10.084591 C236.376,76.596318 336.52,47.55204 336.52,108.5"
                id="a2"
              ></path>
              <path
                d="M0,7.331348 C0,136.146747 51.5,156.665674 152,156.665674"
                id="a1"
              ></path>
              <path
                d="M966.428838,401.668652 C865.928838,401.668652 814.428838,381.149725 814.428838,252.334326"
                id="b5"
                transform="translate(870.428838, 327.001489) rotate(180.000000) translate(-890.428838, -327.001489) "
              ></path>
              <path
                d="M725,403.249735 C725,342.301776 624.856,371.346054 624.856,304.834326"
                id="b4"
                transform="translate(660.928000, 354.042031) rotate(-180.000000) translate(-674.928000, -354.042031) "
              ></path>
              <line
                x1="475.876"
                y1="413.334326"
                x2="475.876"
                y2="304.834326"
                id="b3"
                transform="translate(480.876000, 359.084326) rotate(-180.000000) translate(-475.876000, -359.084326) "
              ></line>
              <path
                d="M333.376,403.249737 C333.376,342.301778 233.232,371.346056 233.232,304.834328"
                id="b2"
                transform="translate(300.304000, 354.042033) scale(-1, 1) rotate(-180.000000) translate(-283.304000, -354.042033) "
              ></path>
              <path
                d="M0,250.332837 C0,379.148236 51.5,399.667163 152,399.667163"
                id="b1"
                transform="translate(90.000000, 325.000000) rotate(90.000000) translate(-76.000000, -325.000000) "
              ></path>
            </g>
          </svg>

          <div className={s.dato}>
            <FullLogo />
          </div>
        </div>
        <div className={s.people}>
          {people.map(person => (
            <div className={s.person} key={person.name}>
              <div className={s.personIcon}>
                <LazyImage src={`/images/faces/${person.image}`} />
              </div>
              <div className={s.personName}>{person.name}</div>
              <div className={s.personRole}>{person.role}</div>
            </div>
          ))}
        </div>
      </Wrapper>
    </div>
  );
}
