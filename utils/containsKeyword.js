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
  let allKeywords = [];

  if (keyword) {
    allKeywords = [keyword];
  }

  if (synonyms) {
    allKeywords = [...allKeywords, ...synonyms.split(', ')];
  }

  if (relatedKeywords) {
    allKeywords = [...allKeywords, ...relatedKeywords.map((k) => k.keyword)];
  }

  return allKeywords;
}

export function containsKeywords(element, seoAnalysis) {
  return (
    seoAnalysis &&
    element &&
    allKeywords(seoAnalysis).some((k) => containsKeyword(element, k))
  );
}
export function containedKeyword(element, seoAnalysis) {
  return (
    seoAnalysis &&
    element &&
    allKeywords(seoAnalysis).find((k) => containsKeyword(element, k))
  );
}
