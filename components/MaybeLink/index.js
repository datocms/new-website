import Link from 'next/link';

export default function MaybeLink({ href, children, ...other }) {
  return href ? (
    <Link href={href}>
      <a {...other}>{children}</a>
    </Link>
  ) : (
    <div {...other}>{children}</div>
  );
}
  