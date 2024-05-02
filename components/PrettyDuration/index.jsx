export default function PrettyDuration(seconds) {
  if (typeof seconds !== 'number') {
    return '—';
  }

  const hours = Math.floor(seconds / 3600);
  const remainingSecondsAfterHours = seconds % 3600;
  const minutes = Math.floor(remainingSecondsAfterHours / 60);
  const remainingSeconds = remainingSecondsAfterHours % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m ${remainingSeconds.toString().padStart(2, '0')}s`;
  }
}
