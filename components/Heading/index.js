const Heading = ({ as: Tag, anchor, children, ...other }) => (
  <Tag {...other} data-with-anchor>
    {children} <a data-anchor id={anchor} />
    <a data-permalink href={`#${anchor}`} />
  </Tag>
);

export default Heading;
