import AgencyForm from 'components/AgencyForm';
import s from './style.module.css';
import 'iframe-resizer/js/iframeResizer.contentWindow';

export default function Form() {
  return (
    <div className={s.container}>
      <div className={s.inner}>
        <AgencyForm action="/api/partner-program/submit" />
      </div>
    </div>
  );
}
