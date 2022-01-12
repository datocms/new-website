import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import Highlight, { highlightStructuredText } from 'components/Highlight';
import Hero from 'components/Hero';
import Head from 'components/Head';
import { useQuerySubscription, Image as DatoImage } from 'react-datocms';
import Masonry from 'react-masonry-css';
import {
  gqlStaticPropsWithSubscription,
  imageFields,
  reviewFields,
} from 'lib/datocms';
import s from './style.module.css';

export const getStaticProps = gqlStaticPropsWithSubscription(
  `
    query {
      allReviews {
        ...reviewFields
      }
      allPartners {
        name
        quotes {
          id
          quote {
            value
          }
          role
          name
          image {
            responsiveImage(imgixParams: { w: 300, h:300, fit: crop, crop: faces, auto: format }){
              ...imageFields
            }
          }
        }
      }
    }

    ${reviewFields}
    ${imageFields}
  `,
);

export default function Wall({ preview, subscription }) {
  const {
    data: { allPartners, allReviews },
  } = useQuerySubscription(subscription);

  const quotes = [
    ...allPartners
      .map((p) =>
        p.quotes.map((q) => ({ ...q, role: `${q.role} @ ${p.name}` })),
      )
      .flat(),
    ...allReviews,
  ];

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
              Hear from hundreds of customers about what changed for the better
              since they switched to DatoCMS
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
          {quotes.map((quote) => (
            <div key={quote.id} className={s.root}>
              <div className={s.quote}>
                {highlightStructuredText(quote.quote)}
              </div>
              <div className={s.content}>
                <DatoImage
                  className={s.image}
                  data={quote.image.responsiveImage}
                />
                <div className={s.authorRole}>
                  <div className={s.name}>{quote.name}</div>
                  <div className={s.role}>{quote.role}</div>
                </div>
              </div>
            </div>
          ))}
        </Masonry>
      </div>
    </Layout>
  );
}
