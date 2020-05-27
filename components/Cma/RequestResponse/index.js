import Prism from 'components/Prism';
import ReactMarkdown from 'react-markdown';
import slugify from 'utils/slugify';

import s from './style.module.css';

const RequestResponse = ({ title, description, chunks }) => (
  <div className={s.reqRes}>
    {title && (
      <h6 className={s.title} id={slugify(title)}>
        {title}
      </h6>
    )}
    {description && <ReactMarkdown source={description} />}

    {chunks.map((chunk) => (
      <div className={s.chunk} key={chunk.title}>
        <div className={s.chunkTitle}>{chunk.title}</div>
        <Prism code={chunk.code} language={chunk.language} />
      </div>
    ))}
  </div>
);

export default RequestResponse;
