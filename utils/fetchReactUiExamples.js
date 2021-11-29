import types from 'datocms-react-ui/types.json';
import { serialize } from 'next-mdx-remote/serialize';

function removeCommonIndentation(example) {
  const lines = example
    .split(/\n/)
    .filter((l, i, all) => l.length !== 0 || (i !== 0 && i !== all.length - 1));

  const spacesPerLine = lines
    .filter((line) => line.length > 0)
    .map((line) => {
      const spaces = line.match(/^\s*/);
      return spaces ? spaces[0].length : 0;
    });

  const commonIndentation = Math.min(...spacesPerLine);

  return lines.map((line) => line.substring(commonIndentation)).join('\n');
}

export default async function fetchReactUiExamples() {
  return (
    await Promise.all(
      types.children
        .filter(
          (child) =>
            child.kindString === 'Function' &&
            child.signatures[0]?.comment?.tags?.some(
              (t) => t.tag === 'example',
            ),
        )
        .map(async (child) => {
          return await Promise.all(
            child.signatures[0].comment.tags
              .filter((t) => t.tag === 'example')
              .map(async (t, i) => {
                const content = removeCommonIndentation(t.text);

                const code = content
                  .match(/```[a-z]*\n([\s\S]*?)\n```/)[1]
                  .trim()
                  .replace(/;$/, '');

                const textualContentLines = content
                  .match(/([\s\S]*?)\n```/)[1]
                  .trim()
                  .split(/\n/);

                const title = textualContentLines.shift();

                const description = textualContentLines.join('\n');

                return {
                  componentName: child.name,
                  code,
                  title,
                  description,
                  serialized: await serialize(code),
                };
              }),
          );
        }),
    )
  ).flat();
}
