import { convert } from 'html-to-text';
import ReactDOMServer from 'react-dom/server';

export default function containsKeyword(element, keyword) {
  const extracted = ReactDOMServer.renderToString(element);
  const converted = convert(extracted, {
    wordwrap: null,
  });

  return (
    element &&
    keyword &&
    keyword
      .split(' ')
      .every((w) => converted.toLowerCase().includes(w.toLowerCase()))
  );
}
