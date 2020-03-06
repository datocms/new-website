import styles from './style.module.css';
import parse, { domToReact } from 'html-react-parser';

export default function Highlight({ style = 'neutral', children }) {
  return <strong className={styles[style]}>{children}</strong>;
}

const parseOptions = {
  replace: ({ name, children }) => {
    if (name === 'strong') {
      return <Highlight>{domToReact(children)}</Highlight>;
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
      return <Highlight>{children}</Highlight>;
    }
  },
};

export const highlightHtml = (html, { noWrappers = true } = {}) =>
  parse(html, noWrappers ? parseOptionsNoWrappers : parseOptions);
