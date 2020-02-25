import Prism from 'components/Prism';
import s from './style.css';

const RequestResponse = ({ chunks }) => (
  <div className={s.reqRes}>
    {
      chunks.map(chunk => (
        <div className={s.chunk} key={chunk.title}>
          <div className={s.chunkTitle}>{chunk.title}</div>
          <Prism code={chunk.code} language={chunk.language} />
        </div>
      ))
    }
  </div>
);

export default RequestResponse;