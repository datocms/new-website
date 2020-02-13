import parse, { domToReact } from 'html-react-parser';
import Highlight, { defaultProps } from 'prism-react-renderer';
import ImageFigure from 'components/ImageFigure';
import { useMemo } from 'react';

export default function SmartMarkdown({ children, imageClassName }) {
  const parseOptions = useMemo(
    () => ({
      replace: ({ name, attribs, children }) => {
        if (name === 'pre' && children[0].name === 'code') {
          const code = children[0];

          return (
            <Highlight
              {...defaultProps}
              code={code.children[0].data.replace(/\n$/, '')}
              language={code.attribs.class || 'unknown'}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={style}>
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

        if (name === 'img') {
          const { src } = attribs;
          return (
            <ImageFigure
              imageClassName={imageClassName}
              data={{
                alt: attribs.alt,
                title: attribs.title,
                url: src,
                format: src
                  .split('.')
                  .pop()
                  .split(/\#|\?/g)[0],
              }}
            />
          );
        }
      },
    }),
    [imageClassName],
  );

  return parse(children, parseOptions);
}
