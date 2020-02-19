import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ActiveLink({ children, ...props }) {
  const router = useRouter();
  const child = React.Children.only(children);

  let className = child.props.className || "";

  if (router.pathname === props.href && router.asPath === props.as && props.activeClassName) {
    className = `${className} ${props.activeClassName}`.trim();
  }

  delete props.activeClassName;

  return <Link {...props}>{React.cloneElement(child, { className })}</Link>;
};