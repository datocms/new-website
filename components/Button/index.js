import cn from 'classnames';
import style from './style.css';

const fsClassNames = {
  big: style.fsBig,
};

const pClassNames = {
  big: style.pBig,
  small: style.pSmall,
};

export default function Button({ as: Component = 'div', children, fs, p, block, disabled, ...other }) {
  return (
    <Component
      {...other}
      className={
        cn(
          style.root,
          {
            [style.disabled]: disabled,
            [style.block]: block,
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