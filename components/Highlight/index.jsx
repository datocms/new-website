import { isParagraph } from 'datocms-structured-text-utils';
import React from 'react';
import { StructuredText, renderRule } from 'react-datocms';
import styles from './style.module.css';

export default function Highlight({ style = 'neutral', children }) {
  return <strong className={styles[style]}>{children}</strong>;
}

export const highlightStructuredText = (
  data,
  { noWrappers = true, highlightWith = Highlight } = {},
) => {
  const Highlighter = highlightWith;

  return (
    <StructuredText
      data={data}
      renderNode={(rawTagName, props, ...children) => {
        const tagName = ['mark'].includes(rawTagName)
          ? Highlighter
          : rawTagName;
        return React.createElement(tagName, props, ...children);
      }}
      customRules={
        noWrappers && [
          renderRule(isParagraph, ({ children, key }) => {
            return <React.Fragment key={key}>{children}</React.Fragment>;
          }),
        ]
      }
    />
  );
};
