export default function PrettyDuration(seconds) {
  if (typeof seconds !== 'number') {
    return '—';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
}
