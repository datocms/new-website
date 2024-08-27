import s from './style.module.css';

/**
 * Add a header. Specify an anchor name to provide an easy deep-link target.
 * @param {string} props.as - Required: The tag to be rendered (e.g., 'h1', 'h2')
 * @param {string} [props.anchor] - Optional: Used to create a permalink and an anchor within the heading
 *
 * @returns {JSX.Element}
 */
const Heading = ({ as: Tag, anchor, children, className, ...other }) => (
  <Tag
    {...other}
    className={`${s.root} ${className || ''}`}
    data-with-anchor={!!anchor}
  >
    {children} {anchor && <a data-anchor={anchor} id={anchor} />}
    {anchor && (
      <a
        data-permalink
        href={`#${anchor}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    )}
  </Tag>
);

export default Heading;
