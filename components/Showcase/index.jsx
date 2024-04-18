import Link from 'next/link';
import Chillys from 'public/images/logos/chillys.svg';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import MatterSupply from 'public/images/logos/matter-supply.svg';
import Wonderland from 'public/images/logos/wonderland.svg';
import s from './style.module.css';

const SUCCESS_STORIES = {
  hashicorp: Hashicorp,
  wonderland: Wonderland,
  chillys: Chillys,
  'matter-supply': MatterSupply,
  // dovetail: Dovetail,
};

export default function Showcase() {
  return (
    <div className={s.root}>
      {Object.entries(SUCCESS_STORIES).map(([slug, Logo]) => {
        return (
          <Link key={slug} href={`/customers/${slug}`}>
            <a className={s.logo}>
              <Logo />
            </a>
          </Link>
        );
      })}
    </div>
  );
}
