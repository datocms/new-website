import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ActiveLink({ children, activeClassName, ...props }) {
  const router = useRouter();
  const child = React.Children.only(children);

  let className = child.props.className || '';

  if (router.pathname === props.href && activeClassName) {
    className = `${className} ${activeClassName}`.trim();
  }

  if (props.href.startsWith('#')) {
    return React.cloneElement(child, { className, href: props.href });
  }

  return <Link {...props}>{React.cloneElement(child, { className })}</Link>;
}
