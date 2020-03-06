export default function getInnerText(children) {
  return children.reduce((acc, child) => {
    if (child.type === 'text') {
      return acc + child.data;
    }
    if (child.type === 'tag') {
      return acc + getInnerText(child.children);
    }
    return acc;
  }, '');
}
