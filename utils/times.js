export default function times(n) {
  return Array.apply(null, { length: n }).map(Number.call, Number);
}
