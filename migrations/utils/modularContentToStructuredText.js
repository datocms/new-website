const {
  rootNodeType,
  blockNodeType,
  blockquoteNodeType,
  codeNodeType,
  validate,
} = require('datocms-structured-text-utils');
const inspect = require('unist-util-inspect');
const markdownToStructuredText = require('./markdownToStructuredText');

const { range } = require('range');

const QUOTE = 'quote';
const CODE_BLOCK = 'code_block';
const TEXT = 'text';
const QUESTION_ANSWER = 'question_answer';

module.exports = async function convertModularContentToStructuredText(
  modularContentValue,
  itemTypesByApiKey,
) {
  if (modularContentValue.length === 0) {
    return null;
  }

  let children = [];

  for (const block of modularContentValue) {
    const { id, meta, ...sanitizedBlock } = block;
    const {
      createdAt,
      updatedAt,
      ...sanitizedAttributes
    } = sanitizedBlock.attributes;

    sanitizedBlock.attributes = sanitizedAttributes;

    switch (block.relationships.itemType.data.id) {
      case itemTypesByApiKey[TEXT].id: {
        const structuredText = await markdownToStructuredText(
          block.attributes.text,
        );
        if (structuredText) {
          children = [...children, ...structuredText.document.children];
        }
        break;
      }
      case itemTypesByApiKey[QUOTE].id: {
        const structuredText = await markdownToStructuredText(
          block.attributes.quote,
        );

        if (structuredText) {
          const node = {
            type: blockquoteNodeType,
            children: structuredText.document.children,
          };

          if (block.attributes.author) {
            node.attribution = block.attributes.author;
          }

          children.push(node);
        }
        break;
      }
      case itemTypesByApiKey[CODE_BLOCK].id: {
        const codeNode = {
          type: codeNodeType,
          language: block.attributes.language,
          code: block.attributes.code,
        };

        if (block.attributes.highlightLines) {
          codeNode.highlight = block.attributes.highlightLines
            .split(/\s*,\s*/)
            .map((str) => {
              const chunks = str.split(/\-/);
              if (chunks.length === 1) {
                return parseInt(chunks[0]) - 1;
              }

              return range(parseInt(chunks[0]) - 1, parseInt(chunks[1]));
            })
            .flat();
        }

        children.push(codeNode);
        break;
      }
      case itemTypesByApiKey[QUESTION_ANSWER].id: {
        sanitizedBlock.attributes = {
          ...sanitizedBlock.attributes,
          structuredTextQuestion: await markdownToStructuredText(
            sanitizedAttributes.question,
          ),
          structuredTextAnswer: await markdownToStructuredText(
            sanitizedAttributes.answer,
          ),
        };

        children.push({
          type: blockNodeType,
          item: sanitizedBlock,
        });
        break;
      }
      default: {
        children.push({ type: blockNodeType, item: sanitizedBlock });
        break;
      }
    }
  }

  const result = {
    schema: 'dast',
    document: {
      type: rootNodeType,
      children,
    },
  };

  const validationResult = validate(result);

  if (!validationResult.valid) {
    console.log(inspect(result));
    throw new Error(validationResult.message);
  }

  return result;
};
