import striptags from 'striptags';
import ReactDOMServer from 'react-dom/server';

function containsKeyword(element, keyword) {
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

function allKeywords(seoAnalysis) {
  const { keyword, synonyms, relatedKeywords } = seoAnalysis;

  return [
    ...synonyms.split(', '),
    ...relatedKeywords.map((k) => k.keyword),
    keyword,
  ];
}

export function containsKeywords(element, seoAnalysis) {
  return (
    seoAnalysis &&
    allKeywords(seoAnalysis).some((k) => containsKeyword(element, k))
  );
}
export function containedKeyword(element, seoAnalysis) {
  return (
    seoAnalysis &&
    allKeywords(seoAnalysis).find((k) => containsKeyword(element, k))
  );
}
