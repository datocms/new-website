import { range } from 'range';
import Paginator from 'paginator';
import s from './style.module.css';
import cn from 'classnames';
import Link from 'next/link';

const GoTo = ({ href, as, index, className, disabled, children }) =>
  disabled ? (
    <span className={cn(className, { [s.disabled]: disabled })}>
      {children}
    </span>
  ) : (
    <Link href={href(index)} as={as(index)}>
      <a className={cn(className, { [s.disabled]: disabled })}>{children}</a>
    </Link>
  );

export default function Pagination({
  perPage,
  currentPage,
  totalEntries,
  href,
  as,
  maxPagesToBeShown = 7,
}) {
  const paginator = new Paginator(perPage, maxPagesToBeShown);

  const {
    pages: pageCount,
    first_page: firstPage,
    has_previous_page: hasPreviousPage,
    has_next_page: hasNextPage,
    previous_page: previousPage,
    next_page: nextPage,
  } = paginator.build(totalEntries, currentPage + 1);

  return (
    <div className={s.root}>
      <GoTo
        href={href}
        as={as}
        index={previousPage - 1}
        className={cn(s.nav, s.link, s.linkPrev)}
        disabled={!hasPreviousPage}
      >
        &laquo; Previous
      </GoTo>

      <div className={s.links}>
        {range(0, pageCount).map(i => (
          <GoTo
            href={href}
            as={as}
            key={i}
            index={firstPage + i - 1}
            className={cn(s.link, {
              [s.linkActive]: firstPage + i - 1 === currentPage,
            })}
          >
            {firstPage + i}
          </GoTo>
        ))}
      </div>

      <GoTo
        href={href}
        as={as}
        index={nextPage - 1}
        className={cn(s.nav, s.link, s.linkNext)}
        disabled={!hasNextPage}
      >
        Next &raquo;
      </GoTo>
    </div>
  );
}
