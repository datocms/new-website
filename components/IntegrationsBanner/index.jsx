import Wrapper from 'components/Wrapper';
import React from 'react';
import s from './style.module.css';

export default function IntegrationsBanner({ title, bubbles, children }) {
  return (
    <div className={s.root}>
      <div className={s.background}>
        <div className={s.backgroundInner}>
          {React.Children.map(bubbles, (child, key) => (
            <div className={s.backgroundImage} key={key}>
              <div className={s.backgroundImageInner}>{child}</div>
            </div>
          ))}
        </div>
      </div>
      <Wrapper>
        <div className={s.foreground}>
          <div className={s.body}>
            <div className={s.title}>{title}</div>
            <div className={s.content}>{children}</div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
