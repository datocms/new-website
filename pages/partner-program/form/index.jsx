import AgencyForm from 'components/AgencyForm';
import 'iframe-resizer/js/iframeResizer.contentWindow';
import s from './style.module.css';

export default function Form() {
  return (
    <div className={s.container}>
      <div className={s.inner}>
        <AgencyForm action="/api/partner-program/submit" />
      </div>
    </div>
  );
}
