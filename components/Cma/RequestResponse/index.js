import Prism from 'components/Prism';
import ReactMarkdownWithHtml from 'react-markdown/with-html';
import slugify from 'utils/slugify';
import gfm from 'remark-gfm';
import Heading from 'components/Heading';

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
        <ReactMarkdownWithHtml
          allowDangerousHtml
          plugins={[gfm]}
          source={description}
          renderers={{
            code: ({ language, value }) => {
              return (
                <Prism
                  code={value}
                  language={language || 'unknown'}
                  showLineNumbers
                />
              );
            },
          }}
        />
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
