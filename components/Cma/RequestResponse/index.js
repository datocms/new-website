import Prism from 'components/Prism';
import ReactMarkdown from 'react-markdown';
import slugify from 'utils/slugify';
import gfm from 'remark-gfm';
import Heading from 'components/Heading';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import s from './style.module.css';

const RequestResponse = ({ title, description, chunks }) => (
  <div className={s.reqRes}>
    {title && (
      <Heading as="h6" className={s.title} anchor={slugify(title)}>
        {title}
      </Heading>
    )}
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

    {chunks.map((chunk) => (
      <div className={s.chunk} key={chunk.title}>
        <div className={s.chunkTitle}>{chunk.title}</div>
        <Prism code={chunk.code} language={chunk.language} />
      </div>
    ))}
  </div>
);

export default RequestResponse;
