import classNames from 'classnames';
import { highlightStructuredText } from 'components/Highlight';
import { Image as DatoImage } from 'react-datocms';
import MaybeLink from '../MaybeLink';
import s from './style.module.css';

export default function QuotesCarousel({ quotes, animated }) {
  return (
    <div className={s.quotes}>
      <div
        className={classNames(s.quotesInner, animated && s.quotesInnerAnimated)}
      >
        {quotes.map((quote) => {
          return (
            <MaybeLink
              href={
                quote.partner ? `/partners/${quote.partner.slug}` : undefined
              }
              key={quote.id}
              className={s.root}
            >
              <div className={s.quote}>
                {highlightStructuredText(quote.quote)}
              </div>
              <div className={s.content}>
                <DatoImage
                  className={s.image}
                  data={quote.image.responsiveImage}
                />
                <div className={s.authorRole}>
                  <div className={s.name}>{quote.name}</div>
                  <div className={s.role}>{quote.role}</div>
                  {quote.partner && (
                    <div className={s.role}>{quote.partner.name}</div>
                  )}
                </div>
              </div>
            </MaybeLink>
          );
        })}
      </div>
    </div>
  );
}
