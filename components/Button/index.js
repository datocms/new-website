import cn from 'classnames';
import style from './style.module.css';

const fsClassNames = {
  big: style.fsBig,
  small: style.fsSmall,
};

const pClassNames = {
  big: style.pBig,
  small: style.pSmall,
  tiny: style.pTiny,
};

const sClassNames = {
  invert: style.sInvert,
};

export default function Button({
  as: Component = 'div',
  children,
  fs,
  p,
  s,
  block,
  disabled,
  ...other
}) {
  return (
    <Component
      {...other}
      className={cn(
        style.root,
        other.className,
        {
          [style.disabled]: disabled,
          [style.block]: block,
        },
        s && sClassNames[s],
        fs && fsClassNames[fs],
        p && pClassNames[p],
      )}
    >
      {children}
    </Component>
  );
}
