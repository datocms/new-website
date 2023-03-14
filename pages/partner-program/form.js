import AgencyForm from 'components/AgencyForm';
import 'iframe-resizer/js/iframeResizer.contentWindow';

export default function Form() {
  return <AgencyForm action="/api/partner-program/submit" />;
}
