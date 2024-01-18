import Head from 'components/Head';
import Hero from 'components/Hero';
import Highlight, { highlightStructuredText } from 'components/Highlight';
import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import {
  gqlStaticPropsWithSubscription,
  imageFields,
  reviewFields,
} from 'lib/datocms';
import Link from 'next/link';
import { Image as DatoImage } from 'react-datocms';
import Masonry from 'react-masonry-css';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

export const getStaticProps = gqlStaticPropsWithSubscription(/* GraphQL */ `
  query {
    allReviews(first: 100) {
      ...reviewFields
      _updatedAt
    }
    allPartnerTestimonials(first: 100) {
      id
      quote {
        value
      }
      role
      name
      image {
        responsiveImage(
          imgixParams: { w: 300, h: 300, fit: crop, crop: faces, auto: format }
        ) {
          ...imageFields
        }
      }
      partner {
        name
        slug
      }
      _updatedAt
    }
  }

  ${reviewFields}
  ${imageFields}
`);

export default function Wall({ preview, subscription }) {
  const {
    data: { allPartnerTestimonials, allReviews },
  } = useQuerySubscription(subscription);

  const quotes = [...allPartnerTestimonials, ...allReviews].sort((a, b) =>
    b._updatedAt.localeCompare(a._updatedAt),
  );

  return (
    <Layout preview={preview}>
      <Head>
        <title>Better, with DatoCMS</title>
      </Head>

      <Wrapper>
        <Hero
          kicker="Customers"
          title={
            <>
              <Highlight>Better</Highlight>, with DatoCMS
            </>
          }
          subtitle={
            <>
              Hear from our customers about what changed for the better since
              they switched to DatoCMS
            </>
          }
        />
      </Wrapper>

      <div className={s.wrapper}>
        <Masonry
          breakpointCols={{
            default: 3,
            1650: 2,
            750: 1,
          }}
          className={s.grid}
          columnClassName={s.column}
        >
          {quotes.map((quote) => {
            return (
              <div key={quote.id} className={s.root}>
                <div className={s.quote}>
                  {highlightStructuredText(quote.quote)}
                </div>
                <div className={s.content}>
                  <DatoImage
                    className={s.image}
                    data={quote.image.responsiveImage}
                  />
                  {quote.partner ? (
                    <Link href={`/partners/${quote.partner.slug}`}>
                      <a className={s.authorRole}>
                        <div className={s.name}>{quote.name}</div>
                        <div className={s.role}>
                          {quote.role} @ {quote.partner.name}
                        </div>
                      </a>
                    </Link>
                  ) : (
                    <div className={s.authorRole}>
                      <div className={s.name}>{quote.name}</div>
                      <div className={s.role}>{quote.role}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </Masonry>
      </div>
    </Layout>
  );
}
