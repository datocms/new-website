import cn from 'classnames';
import style from './style.css';
import CheckIcon from 'icons/regular/check.svg';

const fsClassNames = {
  big: style.fsBig,
};

const pClassNames = {
  big: style.pBig,
};

export default function Checks({ as: Component = 'div', checks, children }) {
  return (
    <Component
      className={cn(style.root)}
    >
      {children}
      <ul className={style.list}>
        {checks.map(check => <li key={check} className={style.check}><CheckIcon /> {check}</li>)}
      </ul>
    </Component>
  );
}