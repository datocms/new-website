import Head from 'components/Head';
import Heading from 'components/Heading';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Layout from 'components/Layout';
import MaybeLink from 'components/MaybeLink';
import Wrapper from 'components/Wrapper';
import { gqlStaticPropsWithSubscription } from 'lib/datocms';
import { groupBy } from 'lodash-es';
import { StructuredText, renderMetaTags } from 'react-datocms';
import slugify from 'utils/slugify';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

export const getStaticProps = gqlStaticPropsWithSubscription(
  /* GraphQL */ `
    {
      page: glossaryPage {
        seo: _seoMetaTags {
          tag
          attributes
          content
        }
      }
      entries: allGlossaryEntries(orderBy: title_ASC, first: 100) {
        id
        title
        description {
          value
        }
        url
      }
    }
  `,
  {
    requiredKeys: ['glossaryPage', 'allGlossaryEntries'],
  },
);

export default function Glossary({ subscription, preview }) {
  const {
    data: { page, entries },
  } = useQuerySubscription(subscription);

  const entriesByLetter = groupBy(entries, (entry) =>
    entry.title[0].toUpperCase(),
  );

  return (
    <Layout preview={preview}>
      <Head>{page && renderMetaTags(page.seo)}</Head>
      <Wrapper>
        <Hero
          title={
            <>
              DatoCMS <Highlight>Glossary</Highlight>
            </>
          }
          subtitle="A comprehensive guide to terms and terminology related to DatoCMS and Headless CMS that you may encounter when using our product, reading our docs, or getting started with headless content management"
        />
        <div className={s.root}>
          <div className={s.toc}>
            <div className={s.tocInner}>
              {Object.keys(entriesByLetter).map((letter) => (
                <a
                  key={letter}
                  className={s.tocEntry}
                  href={`#group-${letter}`}
                >
                  {letter}
                </a>
              ))}
            </div>
          </div>
          <dl className={s.letterGroups}>
            {Object.entries(entriesByLetter).map(([letter, entries]) => (
              <div key={letter} className={s.letterGroup}>
                <Heading
                  as="div"
                  className={s.letterGroupTitle}
                  anchor={`group-${letter}`}
                >
                  {letter}
                </Heading>
                <div className={s.letterGroupEntries}>
                  {entries.map((entry) => (
                    <div key={entry.id} className={s.entry}>
                      <Heading
                        as="dt"
                        className={s.entryTitle}
                        anchor={slugify(entry.title)}
                      >
                        {entry.url ? (
                          <MaybeLink className={s.goto} href={entry.url}>
                            {entry.title}
                          </MaybeLink>
                        ) : (
                          entry.title
                        )}
                      </Heading>
                      <dd className={s.entryDescription}>
                        <StructuredText data={entry.description} />
                      </dd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </dl>
        </div>
      </Wrapper>
    </Layout>
  );
}
