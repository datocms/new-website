// This removes beginning and quotes from a string, like "example" becomes example
// This is mainly used for query string examples in HTTP calls, because adding a quote mark there will break the URL

export const stripQuotes = (inputString) => {
  if (
    inputString &&
    typeof inputString === 'string' &&
    inputString.startsWith('"') &&
    inputString.endsWith('"')
  ) {
    return inputString.substring(1, inputString.length - 1);
  }
  return inputString;
};
