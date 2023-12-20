import Heading from 'components/Heading';
import Prism from 'components/Prism';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkDirective from 'remark-directive';
import gfm from 'remark-gfm';
import visit from 'unist-util-visit';
import slugify from 'utils/slugify';

function findText(node) {
  if (node.type === 'text') {
    return node.value;
  }

  return node.children.map(findText).join(' ');
}

function headingWithAnchor(tagName) {
  // eslint-disable-next-line react/display-name
  return ({ children, node }) => {
    return (
      <Heading as={tagName} anchor={slugify(findText(node))}>
        {children}
      </Heading>
    );
  };
}

function isExample(node) {
  return !!node && node.type === 'leafDirective' && node.name === 'example';
}

function findExamples() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (isExample(node)) {
        const previousNode = index === 0 ? null : parent.children[index - 1];
        const nextNode =
          index === parent.children.length - 1
            ? null
            : parent.children[index + 1];

        node.data = {};
        node.data.hName = 'example';
        node.data.hProperties = {
          id: node.children[0].value,
          singleExample:
            !isExample(previousNode) && !isExample(nextNode) ? 'yes' : 'no',
        };
      }
    });
  };
}

export default function DocDescription({ children, renderExample }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkDirective, findExamples, gfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        h1: headingWithAnchor('h1'),
        h2: headingWithAnchor('h2'),
        h3: headingWithAnchor('h3'),
        h4: headingWithAnchor('h4'),
        h5: headingWithAnchor('h5'),
        h6: headingWithAnchor('h6'),
        // eslint-disable-next-line react/display-name
        pre: ({ children }) => <>{children}</>,
        // eslint-disable-next-line react/display-name
        code: ({ inline, className, children }) => {
          const match = /language-(\w+)/.exec(className || '');
          return inline ? (
            <code>{children}</code>
          ) : (
            <Prism
              code={String(children).replace(/\n$/, '')}
              language={match ? match[1] : 'unknown'}
              showLineNumbers
            />
          );
        },
        // eslint-disable-next-line react/display-name
        example: ({ node }) => {
          if (!renderExample) {
            return null;
          }

          return renderExample(
            node.properties.id,
            node.properties.singleExample === 'yes',
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
