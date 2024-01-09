import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import Highlight, { highlightStructuredText } from 'components/Highlight';
import Hero from 'components/Hero';
import Link from 'next/link';
import Head from 'components/Head';
import { Image as DatoImage } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import Masonry from 'react-masonry-css';
import {
  gqlStaticPropsWithSubscription,
  imageFields,
  reviewFields,
} from 'lib/datocms';
import s from './style.module.css';

export const getStaticProps = gqlStaticPropsWithSubscription(/* GraphQL */ `
  query {
    allReviews(first: 100) {
      ...reviewFields
      _updatedAt
    }
    partner1: allPartners(first: 100) {
      ...partnerQuote
    }
    partner2: allPartners(skip: 100, first: 100) {
      ...partnerQuote
    }
    partner3: allPartners(skip: 200, first: 100) {
      ...partnerQuote
    }
  }

  ${reviewFields}
  ${imageFields}

  fragment partnerQuote on PartnerRecord {
    name
    slug
    quotes {
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
      _updatedAt
    }
  }
`);

export default function Wall({ preview, subscription }) {
  const {
    data: { partner1, partner2, partner3, allReviews },
  } = useQuerySubscription(subscription);

  const allPartners = [...partner1, ...partner2, ...partner3];

  const quotes = [
    ...allPartners
      .map((p) =>
        p.quotes.map((q) => ({
          ...q,
          role: `${q.role} @ ${p.name}`,
          link: `/partners/${p.slug}`,
        })),
      )
      .flat(),
    ...allReviews,
  ].sort((a, b) => b._updatedAt.localeCompare(a._updatedAt));

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
                  {quote.link ? (
                    <Link href={quote.link}>
                      <a className={s.authorRole}>
                        <div className={s.name}>{quote.name}</div>
                        <div className={s.role}>{quote.role}</div>
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
