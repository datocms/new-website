export default function slugify(text) {
  if (typeof text !== 'string') {
    return '';
  }

  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}
