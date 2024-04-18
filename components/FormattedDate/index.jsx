import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

export default function FormattedDate({ date }) {
  return date ? format(parseISO(date), 'PPP') : '???';
}
