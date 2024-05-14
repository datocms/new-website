import Wrapper from 'components/Wrapper';
import s from './style.module.css';
import { Image as DatoImage } from 'react-datocms';
import { highlightStructuredText } from 'components/Highlight';

export default function Quote({ review }) {
  return (
    <Wrapper>
      <div className={s.root}>
        <div className={s.quote}>{highlightStructuredText(review.quote)}</div>
        <div className={s.content}>
          <DatoImage className={s.image} data={review.image.responsiveImage} />
          <div className={s.authorRole}>
            <div className={s.name}>{review.name}</div>
            <div className={s.role}>{review.role}</div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
