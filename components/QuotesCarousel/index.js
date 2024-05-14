import classNames from 'classnames';
import { highlightStructuredText } from 'components/Highlight';
import { Image as DatoImage } from 'react-datocms';
import times from 'utils/times';
import MaybeLink from '../MaybeLink';
import s from './style.module.css';

export default function QuotesCarousel({ quotes, animated }) {
  return (
    <div
      className={classNames(s.quotes, animated && s.quotesAnimated)}
      style={{ '--items-count': quotes.length }}
    >
      <div className={s.quotesInner}>
        {times(animated ? (quotes.length / 4 > 1 ? 2 : 3) : 1).map((repeat) =>
          quotes.map((quote) => {
            return (
              <MaybeLink
                href={
                  quote.partner ? `/partners/${quote.partner.slug}` : undefined
                }
                key={`${quote.id}-${repeat}`}
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
                      <div className={s.company}>{quote.partner.name}</div>
                    )}
                  </div>
                </div>
              </MaybeLink>
            );
          }),
        )}
      </div>
    </div>
  );
}
