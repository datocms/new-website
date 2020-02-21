import parse, { domToReact } from 'html-react-parser';
import theme from "custom-prism-react-renderer/themes/duotoneDark";
import Highlight, { defaultProps } from 'custom-prism-react-renderer';
import ImageFigure from 'components/ImageFigure';
import { useMemo } from 'react';
import slugify from 'utils/slugify';
import getInnerText from 'utils/getInnerText';
import emojify from 'utils/emojify';

export default function SmartMarkdown({ children, imageClassName }) {
  const parseOptions = useMemo(
    () => ({
      replace: ({ type, name, data, attribs, children }) => {
        if (type === 'text') {
          return <>{emojify(data)}</>;
        }

        if (type === 'tag' && name.match(/^h[1-6]$/)) {
          const innerText = getInnerText(children);
          const Tag = name;

          return (
            <Tag {...attribs} data-with-anchor>
              {domToReact(children, parseOptions)}{' '}
              <a data-anchor id={slugify(innerText)} />
              <a data-permalink href={`#${slugify(innerText)}`} />
            </Tag>
          );
        }

        if (name === 'pre' && children[0].name === 'code') {
          const code = children[0];

          return (
            <Highlight
              {...defaultProps}
              theme={theme}
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
