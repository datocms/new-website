import striptags from 'striptags';
import ReactDOMServer from 'react-dom/server';

export default function containsKeyword(element, keyword) {
  const extracted = ReactDOMServer.renderToString(element);
  const converted = striptags(extracted);

  return (
    element &&
    keyword &&
    keyword
      .split(' ')
      .every((w) => converted.toLowerCase().includes(w.toLowerCase()))
  );
}
