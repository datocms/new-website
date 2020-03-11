import s from './style.module.css';
import cn from 'classnames';
import theme from 'custom-prism-react-renderer/themes/palenight';
import Highlight, { defaultProps } from 'custom-prism-react-renderer';

export default function CodeExcerpt({ code, language }) {
  return (
    <Highlight {...defaultProps} theme={theme} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={cn(className, s.code, s.result)} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
