import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import UiChrome from 'components/UiChrome';
import { Image as DatoImage } from 'react-datocms';
import s from './style.module.css';
import Link from 'next/link';

export default function TryDemoCta({
  image,
  title,
  description,
  windowTitle,
  href,
  docsAs,
  cta,
}) {
  return (
    <Wrapper>
      <div className={s.root}>
        <div className={s.left}>
          <div className={s.chrometop}>
            <UiChrome title={windowTitle}>
              <DatoImage data={image} className={s.screenshot} />
            </UiChrome>
          </div>
          <div className={s.chromebottom}>
            <UiChrome title="pages/homepage.js - Visual Studio Code">
              <div className={s.code} />
            </UiChrome>
          </div>
        </div>
        <div className={s.box}>
          <div className={s.kicker}>Try our Project starter</div>
          <h2 className={s.title}>{title}</h2>
          <div className={s.description}>{description}</div>
          <div className={s.actions}>
            <Button as="a" href={href}>
              {cta}
            </Button>
            {docsAs && (
              <span className={s.docs}>
                <span> or </span>
                <Link href={docsAs}>
                  <a>Read our docs</a>
                </Link>
              </span>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
