import cn from 'classnames';
import CheckIcon from 'public/icons/regular/check.svg';
import style from './style.module.css';

const fsClassNames = {
  big: style.fsBig,
};

const pClassNames = {
  big: style.pBig,
};

export default function Checks({ as: Component = 'div', checks, children }) {
  return (
    <Component className={cn(style.root)}>
      {children}
      <ul className={style.list}>
        {checks.map((check) => (
          <li key={check} className={style.check}>
            <CheckIcon /> {check}
          </li>
        ))}
      </ul>
    </Component>
  );
}
