import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import UIChrome from 'components/UIChrome';
import { Image } from 'react-datocms';
import s from './style.module.css';

export default function TryDemoCta({ image, title, description, href }) {
  return (
    <Wrapper>
      <div className={s.root}>
        <div className={s.left}>
          <div className={s.chrometop}>
            <UIChrome title="Next.js + DatoCMS demo">
              <Image data={image} className={s.screenshot} />
            </UIChrome>
          </div>
          <div className={s.chromebottom}>
            <UIChrome title="pages/homepage.js - Visual Studio Code">
              <div className={s.code} />
            </UIChrome>
          </div>
        </div>
        <div className={s.box}>
          <div className={s.kicker}>Give DatoCMS a spin</div>
          <div className={s.title}>{title}</div>
          <div className={s.description}>{description}</div>
          <Button as="a" href={href}>
            Start project
          </Button>
        </div>
      </div>
    </Wrapper>
  );
}
