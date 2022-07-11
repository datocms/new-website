import s from './style.module.css';

const Heading = ({ as: Tag, anchor, children, className, ...other }) => (
  <Tag
    {...other}
    className={`${s.root} ${className || ''}`}
    data-with-anchor={!!anchor}
  >
    {children} {anchor && <a data-anchor={anchor} id={anchor} />}
    {anchor && <a data-permalink href={`#${anchor}`} />}
  </Tag>
);

export default Heading;
