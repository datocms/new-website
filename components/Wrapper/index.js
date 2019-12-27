import style from './style.css';

export default function Wrapper({ as: Component = 'div', children }) {
  return <Component className={style.wrapper}>{children}</Component>;
};