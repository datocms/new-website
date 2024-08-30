import Button from 'components/Button';
import Checks from 'components/Checks';
import Wrapper from 'components/Wrapper';
import Link from 'next/link';
import s from './style.module.css';

export default function FinalCta({
  title = 'Start using DatoCMS today',
  subtitle = "According to Gartner 89% of companies plan to compete primarily on the basis of customer experience this year. Don't get caught unprepared.",
  buttonText = 'Try it for free!',
  checks = ['No credit card', 'Easy setup'],
  href = '/pricing',
}) {
  return (
    <Wrapper>
      <Link href={href}>
        <a className={s.root}>
          <div className={s.rootInner}>
            <div className={s.body}>
              <div className={s.title} dangerouslySetInnerHTML={{__html: title}}></div>
              <div className={s.subtitle} dangerouslySetInnerHTML={{__html: subtitle}}></div>
            </div>
            <div className={s.action}>
              <Checks checks={checks}>
                <Button fs="big">{buttonText}</Button>
              </Checks>
            </div>
          </div>
        </a>
      </Link>
    </Wrapper>
  );
}
