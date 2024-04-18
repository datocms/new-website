import cn from 'classnames';
import React, { useState } from 'react';
import s from './style.module.css';

export default function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={s.root}>
      <div className={s.handles}>
        {React.Children.map(children, (child, index) => (
          <button
            type="button"
            key={index}
            onClick={() => setActiveTab(index)}
            className={cn(s.handle, {
              [s.handleCurrent]: activeTab === index,
              [s.handleCode]: child.props.code,
            })}
          >
            <span>{child.props.title}</span>
          </button>
        ))}
      </div>
      {React.Children.map(children, (child, index) => {
        if (!child) {
          return undefined;
        }

        return (
          <div
            key="content"
            className={cn(s.content, {
              [s.contentVisible]: activeTab === index,
            })}
          >
            {child.props.children}
          </div>
        );
      })}
    </div>
  );
}

export const Tab = ({ title, children }) => {
  return (
    <div>
      <div>{title}</div>
      <div>{children}</div>
    </div>
  );
};
