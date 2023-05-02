import { replace } from '@wordpress/shortcode';

export function parseShortCodes(text, codes) {
  const meta = {};

  const newText = codes.reduce(
    (result, code) =>
      replace(code, result, (match) => {
        meta[code] = match.attrs.named || {};
        return '';
      }),
    text,
  );

  return { ...meta, id: text, content: newText };
}

export function toCss(style) {
  if (!style) {
    return {};
  }

  return {
    ...(style.align ? { textAlign: style.align } : {}),
    ...(style.width ? { width: style.width } : {}),
  };
}
