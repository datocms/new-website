import parse, { domToReact } from 'html-react-parser';
import Prism from 'components/Prism';
import ImageFigure from 'components/ImageFigure';
import Heading from 'components/Heading';
import { useMemo } from 'react';
import slugify from 'utils/slugify';
import getInnerText from 'utils/getInnerText';

export default function SmartMarkdown({ children, imageClassName }) {
  const parseOptions = useMemo(
    () => ({
      replace: ({ type, name, data, attribs, children }) => {
        if (type === 'tag' && name.match(/^h[1-6]$/)) {
          const innerText = getInnerText(children);

          return (
            <Heading
              {...attribs}
              anchor={slugify(innerText)}
              as={name}
              data-with-anchor
            >
              {domToReact(children, parseOptions)}
            </Heading>
          );
        }

        if (name === 'pre' && children[0].name === 'code') {
          const code = children[0];

          return (
            <Prism
              code={code.children[0].data.replace(/\n$/, '')}
              language={code.attribs.class || 'unknown'}
            />
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
                format: src.split('.').pop().split(/\#|\?/g)[0],
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
