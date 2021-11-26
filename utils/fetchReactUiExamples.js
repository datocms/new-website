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
          const exampleNames = child.signatures[0].comment.tags
            .find((t) => t.tag === 'examplenames')
            .text.trim()
            .split(/\s*,\s*/);

          return await Promise.all(
            child.signatures[0].comment.tags
              .filter((t) => t.tag === 'example')
              .map(async (t, i) => {
                const content = removeCommonIndentation(t.text).replace(
                  /;$/,
                  '',
                );

                return {
                  componentName: child.name,
                  exampleName: exampleNames[i],
                  content: content.trim(),
                  serialized: await serialize(content, {
                    scope: {
                      ctx: {
                        mode: 'renderPage',
                        bodyPadding: [0, 0, 0, 0],
                        theme: {
                          primaryColor: 'rgb(226, 87, 87)',
                          accentColor: 'rgb(75, 199, 216)',
                          semiTransparentAccentColor: 'rgb(75, 199, 216, 0.1)',
                          lightColor: 'rgb(229, 249, 252)',
                          darkColor: 'rgb(80, 50, 83)',
                        },
                      },
                    },
                  }),
                };
              }),
          );
        }),
    )
  ).flat();
}
