import Prism from 'components/Prism';
import gfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import Heading from 'components/Heading';
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

export default function DocDescription({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[gfm]}
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
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
