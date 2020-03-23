import Wrapper from 'components/Wrapper';
import s from './style.module.css';
import { Image } from 'react-datocms';
import { highlightHtml } from 'components/Highlight';

export default function Quote({ review }) {
  return (
    <Wrapper>
      <div className={s.root}>
        <div className={s.quote}>{highlightHtml(review.quote)}</div>
        <div className={s.content}>
          <Image className={s.image} data={review.image.responsiveImage} />
          <div className={s.authorRole}>
            <div className={s.name}>{review.name}</div>
            <div className={s.role}>{review.role}</div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
