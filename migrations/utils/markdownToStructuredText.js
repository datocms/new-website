const unified = require('unified');
const toHast = require('mdast-util-to-hast');
const parse = require('remark-parse');
const { hastToDast } = require('datocms-html-to-structured-text');
const { validate } = require('datocms-structured-text-utils');
const inspect = require('unist-util-inspect');

module.exports = async function markdownToStructuredText(text, settings) {
  const mdastTree = unified().use(parse).parse(text);
  const hastTree = toHast(mdastTree);
  const document = await hastToDast(hastTree, settings);

  const validationResult = validate(document);

  if (!validationResult.valid) {
    console.log(inspect(document));
    throw new Error(validationResult.message);
  }

  return {
    schema: 'dast',
    document: document,
  };
};
