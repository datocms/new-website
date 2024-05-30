import LazyImage from 'components/LazyImage';
import Link from 'next/link';
import { Image as DatoImage } from 'react-datocms';
import s from './style.module.css';

export default function MarketplaceCard({
  href,
  image,
  technology,
  text,
  badge,
  label,
  size = 'medium',
  orientation = 'vertical',
}) {
  return (
    <Link href={href}>
      <a className={s.card} data-size={size} data-orientation={orientation}>
        <div className={s.imageWrapper}>
          {image ? (
            <DatoImage className={s.cardImage} data={image} />
          ) : (
            <figure className={s.cardTechnology}>
              <LazyImage
                className={s.technologyLogo}
                src={
                  technology.squareLogo
                    ? technology.squareLogo.url
                    : technology.logo.url
                }
              />
            </figure>
          )}
        </div>
        <article className={s.cardContent}>
          <h2 className={s.cardTitle}>{text.title}</h2>
          <p className={s.cardDescription}>{text.description}</p>
          {image && technology && (
            <figure className={s.technology}>
              <LazyImage
                className={s.technologyLogo}
                src={technology.logo.url}
              />
            </figure>
          )}
          <footer className={s.cardFooter}>
            {badge && (
              <div className={s.cardBadge}>
                <span>{badge.emoji}</span>
                <span>{badge.name}</span>
              </div>
            )}
            {label && <span className={s.cardLabel}>{label}</span>}
          </footer>
        </article>
      </a>
    </Link>
  );
}
