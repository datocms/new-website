const unified = require('unified');
const toHast = require('mdast-util-to-hast');
const parse = require('remark-parse');
const { hastToStructuredText } = require('datocms-html-to-structured-text');
const { validate, isSpan } = require('datocms-structured-text-utils');
const inspect = require('unist-util-inspect');
const map = require('unist-util-map');
const emojify = require('./emojify');

module.exports = async function markdownToStructuredText(text, settings) {
  if (!text) {
    return null;
  }

  const mdastTree = unified().use(parse).parse(text);
  const hastTree = toHast(mdastTree);
  const result = await hastToStructuredText(hastTree, settings);

  const validationResult = validate(result);

  if (!validationResult.valid) {
    console.log(inspect(result));
    throw new Error(validationResult.message);
  }

  if (!result) {
    return result;
  }

  return {
    ...result,
    document: map(result.document, (node) => {
      if (!isSpan(node)) {
        return node;
      }

      return {
        ...node,
        value: emojify(node.value),
      };
    }),
  };
};
