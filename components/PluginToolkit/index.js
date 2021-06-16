import React from 'react';
import gravatar from 'utils/gravatar';
import MegaphoneIcon from 'public/icons/regular/megaphone.svg';
import Link from 'next/link';
import s from './style.module.css';
import { Line, Text, Copy, Image } from 'components/FakeContent';
import Wrapper from 'components/Wrapper';
import PluginBox from 'components/PluginBox';

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
export const Badge = ({ children }) => (
  <span className={s.badge}>{children}</span>
);

export const Announce = ({ href, children }) => (
  <Link href={href}>
    <a className={s.announce}>
      <MegaphoneIcon /> {children} →
    </a>
  </Link>
);

export const PluginDetails = ({
  isFallback,
  title,
  shortTitle,
  description,
  shortDescription,
  content,
  image,
  actions,
  announce,
  info,
  gallery,
}) => (
  <Wrapper>
    <div className={s.split}>
      <div className={s.content}>
        <div className={s.header}>
          <div className={s.title}>
            {isFallback ? <Text width={30} /> : title}
          </div>
          <div className={s.description}>
            {isFallback ? <Copy /> : description}
          </div>
          <div className={s.action}>{actions}</div>
        </div>
        {gallery && (
          <div className={s.gallery}>
            <div className={s.galleryInner}>
              {isFallback ? (
                <Image />
              ) : (
                React.Children.map(gallery, (el) => (
                  <div className={s.galleryImage}>{el}</div>
                ))
              )}
            </div>
          </div>
        )}
        {announce}

        {content && <div className={s.readme}>{content}</div>}
      </div>
      <div className={s.sidebar}>
        <div className={s.sidebarInner}>
          <div className={s.pluginBox}>
            <PluginBox
              isFallback={isFallback}
              title={shortTitle || title}
              image={image}
              description={shortDescription}
              actions={actions}
            />
          </div>
          <div className={s.info}>{info}</div>
        </div>
      </div>
    </div>
  </Wrapper>
);
