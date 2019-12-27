import cn from 'classnames';
import style from './style.css';

const fsClassNames = {
  big: style.fsBig,
};

const pClassNames = {
  big: style.pBig,
};

export default function Button({ as: Component = 'div', children, fs, p, disabled, ...other }) {
  return (
    <Component
      {...other}
      className={
        cn(
          style.root,
          {
            [style.disabled]: disabled,
          },
          fs && fsClassNames[fs],
          p && pClassNames[p],
        )
      }
    >
      {children}
    </Component>
  );
}