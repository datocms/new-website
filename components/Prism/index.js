import theme from 'custom-prism-react-renderer/themes/nightOwl';
import Highlight, { defaultProps } from 'custom-prism-react-renderer';
import cn from 'classnames';
import s from './style.module.css';
import { range } from 'range';
import { useMemo } from 'react';

export default ({ code, language, showLineNumbers, highlightLines }) => {
  const lines = useMemo(() => {
    if (!highlightLines) {
      return [];
    }

    return highlightLines
      .split(/\s*,\s*/)
      .map(str => {
        const chunks = str.split(/\-/);
        if (chunks.length === 1) {
          return parseInt(chunks[0]);
        }

        return range(parseInt(chunks[0]), parseInt(chunks[1]) + 1);
      })
      .flat();
  }, [highlightLines]);

  const linesCount = useMemo(() => {
    return code.split(/\r\n|\r|\n/).length;
  }, [code]);

  return (
    <Highlight {...defaultProps} theme={theme} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => {
            const lineProps = getLineProps({ line, key: i });

            return (
              <div
                {...lineProps}
                className={cn(lineProps.className, {
                  [s.highlight]: lines.includes(i + 1),
                  [s.showLineNumbers]: showLineNumbers,
                })}
                data-line-number={`${i + 1}`.padStart(
                  linesCount.toString().length,
                  ' ',
                )}
              >
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
};
