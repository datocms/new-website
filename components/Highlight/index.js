import React from 'react';
import styles from './style.module.css';
import { StructuredText, renderRule } from 'react-datocms';
import { isParagraph } from 'datocms-structured-text-utils';

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
      renderNode={(tagName, props, ...children) => {
        const TagName = ['mark'].includes(tagName) ? Highlighter : tagName;
        return <TagName {...props}>{children}</TagName>;
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
