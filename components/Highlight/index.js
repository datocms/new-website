import styles from './style.module.css';
import parse, { domToReact } from 'html-react-parser';
import { StructuredText, renderRule } from 'react-datocms';
import { isParagraph } from 'datocms-structured-text-utils';

export default function Highlight({ style = 'neutral', children }) {
  return <strong className={styles[style]}>{children}</strong>;
}

export const highlightHtml = (
  html,
  { noWrappers = true, highlightWith = Highlight } = {},
) => {
  const Highlighter = highlightWith;

  const parseOptions = {
    replace: ({ name, children }) => {
      if (name === 'strong') {
        return <Highlighter>{domToReact(children)}</Highlighter>;
      }
    },
  };

  const parseOptionsNoWrappers = {
    replace: ({ name, children }) => {
      if (name === 'p') {
        return (
          <React.Fragment>{domToReact(children, parseOptions)}</React.Fragment>
        );
      }

      if (name === 'strong') {
        return <Highlighter>{children}</Highlighter>;
      }
    },
  };

  return parse(html.trim(), noWrappers ? parseOptionsNoWrappers : parseOptions);
};

export const highlightStructuredText = (
  data,
  { noWrappers = true, highlightWith = Highlight } = {},
) => {
  const Highlighter = highlightWith;

  return (
    <StructuredText
      data={data}
      renderNode={(tagName, props, ...children) => {
        const TagName = ['strong', 'mark'].includes(tagName)
          ? Highlighter
          : tagName;
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
