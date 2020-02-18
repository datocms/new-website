import Wrapper from 'components/Wrapper';
import Link from 'next/link';
import Button from 'components/Button';
import Checks from 'components/Checks';
import s from './style.css';

export default function FinalCta() {
  return (
    <Wrapper>
      <a href="https://dashboard.datocms.com/signup" className={s.root}>
        <div className={s.rootInner}>
          <div className={s.body}>
            <div className={s.title}>Start using DatoCMS today</div>
            <div className={s.subtitle}>
              According to Gartner 89% of companies plan to compete primarily on
              the basis of customer experience this year. Don't get caught
              unprepared.
            </div>
          </div>
          <div className={s.action}>
            <Checks checks={['No credit card', 'Easy setup']}>
              <Button fs="big">Try it for free!</Button>
            </Checks>
          </div>
        </div>
      </a>
    </Wrapper>
  );
}
