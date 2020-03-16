import styles from './style.module.css';
import parse, { domToReact } from 'html-react-parser';

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

  return parse(html, noWrappers ? parseOptionsNoWrappers : parseOptions);
};
