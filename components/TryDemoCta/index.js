import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import UiChrome from 'components/UiChrome';
import { Image } from 'react-datocms';
import docHref from 'utils/docHref';
import s from './style.module.css';
import Link from 'next/link';

export default function TryDemoCta({
  image,
  title,
  description,
  windowTitle,
  href,
  docsAs,
}) {
  return (
    <Wrapper>
      <div className={s.root}>
        <div className={s.left}>
          <div className={s.chrometop}>
            <UiChrome title={windowTitle}>
              <Image data={image} className={s.screenshot} />
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
          <div className={s.title}>{title}</div>
          <div className={s.description}>{description}</div>
          <div className={s.actions}>
            <Button as="a" href={href}>
              Start new project
            </Button>
            {docsAs && (
              <>
                <span> or </span>
                <Link as={docsAs} href={docHref(docsAs)}>
                  <a className={s.docs}>Read our docs</a>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
