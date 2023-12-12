import { range } from 'range';
import Paginator from 'paginator';
import s from './style.module.css';
import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

const GoTo = ({ href, index, className, disabled, children, query }) =>
  disabled ? (
    <span className={cn(className, { [s.disabled]: disabled })}>
      {children}
    </span>
  ) : (
    <Link href={{ pathname: href(index), query }}>
      <a className={cn(className, { [s.disabled]: disabled })}>{children}</a>
    </Link>
  );

export default function Pagination({
  perPage,
  currentPage,
  totalEntries,
  href,
  maxPagesToBeShown = 4,
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

  const router = useRouter();

  if (pageCount === 1) {
    return null;
  }

  return (
    <div className={s.root}>
      <GoTo
        href={href}
        index={previousPage - 1}
        className={cn(s.nav, s.link, s.linkPrev)}
        disabled={!hasPreviousPage}
        query={router.query}
      >
        &laquo; Previous
      </GoTo>

      <div className={s.links}>
        {range(0, pageCount).map((i) => (
          <GoTo
            href={href}
            key={i}
            index={firstPage + i - 1}
            className={cn(s.link, {
              [s.linkActive]: firstPage + i - 1 === currentPage,
            })}
            query={router.query}
          >
            {firstPage + i}
          </GoTo>
        ))}
      </div>

      <GoTo
        query={router.query}
        href={href}
        index={nextPage - 1}
        className={cn(s.nav, s.link, s.linkNext)}
        disabled={!hasNextPage}
      >
        Next &raquo;
      </GoTo>
    </div>
  );
}
