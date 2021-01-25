import visit from 'unist-util-visit';

const filterNodes = (document, predicate) => {
  const result = [];

  visit(document, predicate, (node) => {
    result.push(node);
  });

  return result;
};

export default filterNodes;
