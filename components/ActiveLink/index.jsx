import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export default function ActiveLink({ children, ...props }) {
  const router = useRouter();
  const child = React.Children.only(children);

  let className = child.props.className || '';

  if (isActive(props, router) && props.activeClassName) {
    className = `${className} ${props.activeClassName}`.trim();
  }

  if (props.href.startsWith('#')) {
    return React.cloneElement(child, { className, href: props.href });
  }

  return <Link {...props}>{React.cloneElement(child, { className })}</Link>;
}

export function isActive(props, router) {
  const componentUrl = props.as ? props.as : props.href;
  const routerUrl = props.as ? router.asPath : router.pathname;
  const urlTokens = routerUrl.split('/');

  if (
    props.activateParentDepth &&
    urlTokens.length > props.activateParentDepth
  ) {
    const parentPageIdx = props.activateParentDepth - 1;
    const componentUrlTokens = componentUrl.split('/');

    return (
      urlTokens[parentPageIdx] === componentUrlTokens[parentPageIdx] &&
      props.activeClassName
    );
  }

  return props.href === router.asPath && props.activeClassName;
}
