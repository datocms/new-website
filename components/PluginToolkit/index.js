import gravatar from 'utils/gravatar';
import LeftIcon from 'public/icons/regular/chevron-double-left.svg';
import MegaphoneIcon from 'public/icons/regular/megaphone.svg';
import Link from 'next/link';
import s from './style.module.css';
import { Line, Text, Copy, Image } from 'components/FakeContent';

export const PluginInfo = ({ children }) => {
  return <div className={s.root}>{children}</div>;
};

export const Info = ({ title, children, isFallback }) => {
  return (
    <div className={s.block}>
      <div className={s.blockTitle}>{title}</div>
      {isFallback ? <Line /> : children}
    </div>
  );
};

export const NameWithGravatar = ({ name, email }) => (
  <>
    <img
      alt="Author gravatar"
      className={s.avatar}
      src={gravatar(email, {
        s: 80,
        d: 'retro',
      })}
    />
    {name}
  </>
);

export const Header = ({ isFallback, title, description, children }) => (
  <div className={s.header}>
    <div className={s.title}>{isFallback ? <Text width={30} /> : title}</div>
    <div className={s.description}>{isFallback ? <Copy /> : description}</div>
    {children && (
      <div className={s.gallery}>
        <div className={s.galleryInner}>
          {isFallback ? (
            <Image />
          ) : (
            React.Children.map(children, el => (
              <div className={s.galleryImage}>{el}</div>
            ))
          )}
        </div>
      </div>
    )}
  </div>
);

export const Badge = ({ children }) => (
  <span className={s.badge}>{children}</span>
);

export const Back = ({ href, label }) => (
  <Link href={href}>
    <a className={s.back}>
      <LeftIcon /> {label}
    </a>
  </Link>
);

export const Announce = ({ href, as, children }) => (
  <Link as={as} href={href}>
    <a className={s.announce}>
      <MegaphoneIcon /> {children} →
    </a>
  </Link>
);
