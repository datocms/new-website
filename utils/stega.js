import { vercelStegaSplit } from '@vercel/stega';

export function clean(string) {
  const { cleaned } = vercelStegaSplit(string);

  return cleaned;
}
