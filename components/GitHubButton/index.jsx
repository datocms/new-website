import Icon from 'public/icons/brands/github.svg';
import s from './style.module.css';

export default function GitHubButton({ href, children }) {
  return (
    <a className={s.button} href={href} target="_blank" rel="noreferrer">
      <Icon />
      {children}
    </a>
  );
}
