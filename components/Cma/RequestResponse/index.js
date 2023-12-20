import Heading from 'components/Heading';
import Prism from 'components/Prism';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import gfm from 'remark-gfm';
import slugify from 'utils/slugify';

import classNames from 'classnames';
import { useState } from 'react';
import s from './style.module.css';

const RequestResponse = ({ title, description, chunks, startExpanded }) => {
  const anchor = slugify(title);
  const [collapsed, setCollapsed] = useState(
    startExpanded
      ? false
      : typeof document === 'undefined' ||
          document.location.hash !== `#${anchor}`,
  );
  const [activeChunkTitle, setActiveChunkTitle] = useState(chunks[0].title);
  const activeChunk = chunks.find((c) => c.title === activeChunkTitle);

  return (
    <div className={s.reqRes}>
      {title && (
        <Heading
          as="h6"
          className={s.title}
          anchor={anchor}
          onClick={() => {
            setCollapsed((x) => !x);
          }}
        >
          <span className={s.pill}>Example</span>{' '}
          <span className={s.titleTitle}>{title}</span>
        </Heading>
      )}

      {!collapsed && (
        <>
          {description && (
            <div className={s.description}>
              <ReactMarkdown
                remarkPlugins={[gfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  // eslint-disable-next-line react/display-name
                  pre: ({ children }) => <>{children}</>,
                  // eslint-disable-next-line react/display-name
                  code: ({ inline, className, children }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return inline ? (
                      <code>{children}</code>
                    ) : (
                      <Prism
                        code={String(children).replace(/\n$/, '')}
                        language={match ? match[1] : 'unknown'}
                        showLineNumbers
                      />
                    );
                  },
                }}
              >
                {description}
              </ReactMarkdown>
            </div>
          )}

          <div className={s.tabs}>
            {chunks.map((chunk) => (
              <button
                type="button"
                className={classNames(
                  s.tab,
                  activeChunkTitle === chunk.title && s.tabActive,
                )}
                key={chunk.title}
                onClick={() => {
                  setActiveChunkTitle(chunk.title);
                }}
              >
                {chunk.title}
              </button>
            ))}
          </div>

          <div className={s.chunk}>
            {activeChunk.description && (
              <div className={s.description}>{activeChunk.description}</div>
            )}
            {activeChunk.code && (
              <Prism code={activeChunk.code} language={activeChunk.language} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RequestResponse;
