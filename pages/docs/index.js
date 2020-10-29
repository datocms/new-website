import { gqlStaticProps, seoMetaTagsFields } from 'lib/datocms';
import DocsLayout from 'components/DocsLayout';
import gql from 'graphql-tag';
import Link from 'next/link';
import Head from 'next/head';
import s from './style.module.css';
import { renderMetaTags } from 'react-datocms';

export const getStaticProps = gqlStaticProps(
  gql`
    query {
      page: docsPage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
      roots: allDocGroups(filter: { parent: { exists: false } }) {
        name
        children {
          name
          slug
          pages {
            slugOverride
            page {
              slug
            }
          }
          children {
            name
            slug
            pages {
              slugOverride
              page {
                slug
              }
            }
          }
        }
      }
    }
    ${seoMetaTagsFields}
  `,
);

const normalize = (slug) => (slug === 'index' ? '' : `/${slug}`);

const Sidebar = ({ roots }) => (
  <>
    {roots.map((root) => (
      <div className={s.group} key={root.slug}>
        <div className={s.groupName}>{root.name}</div>
        <div className={s.guides}>
          {root.children.map((sub) => (
            <Link
              href={`/docs/${sub.slug}${normalize(
                sub.pages[0].slugOverride || sub.pages[0].page.slug,
              )}`}
              key={sub.slug}
            >
              <a className={s.guide}>{sub.name}</a>
            </Link>
          ))}
        </div>
      </div>
    ))}
    <div className={s.group}>
      <div className={s.groupName}>Community</div>
      <div className={s.guides}>
        <Link href="/docs/community-tutorials">
          <a className={s.guide}>Community tutorials</a>
        </Link>
      </div>
    </div>
  </>
);

export default function Docs({ roots, preview, page }) {
  return (
    <DocsLayout preview={preview} sidebar={<Sidebar roots={roots} />}>
      <Head>{renderMetaTags(page.seo)}</Head>
      <div className={s.container}>
        <h2 className={s.title}>Documentation</h2>
        <p className={s.subtitle}>
          Whether you’re a startup or a global enterprise, learn how to
          integrate with DatoCMS to manage your content in a centralized,
          structured hub.
        </p>

        <h6 className={s.introTitle}>Start with your use case</h6>
        <div className={s.useCaseCards}>
          <Link href="/docs/general-concepts">
            <a className={s.useCaseCard}>
              <div className={s.useCaseCardTitle}>Getting started</div>
              <p>Learn all the basic concepts and features behind DatoCMS.</p>
            </a>
          </Link>
          <Link href="/docs/content-modelling">
            <a className={s.useCaseCard}>
              <div className={s.useCaseCardTitle}>Model your schema</div>
              <p>
                Build your administrative area and define the structure of your
                content.
              </p>
            </a>
          </Link>
          <Link href="/docs/content-delivery-api">
            <a className={s.useCaseCard}>
              <div className={s.useCaseCardTitle}>GraphQL API</div>
              <p>Learn how to fetch your content into any frontend project.</p>
            </a>
          </Link>
        </div>

        <h6 className={s.introTitle}>Popular integrations</h6>
        <div className={s.useCaseCards}>
          <Link href="/docs/next-js">
            <a className={s.useCaseCard}>
              <div className={s.useCaseCardTitle}>Next.js</div>
              <p>Learn how to integrate your Next.js website with DatoCMS</p>
            </a>
          </Link>
          <Link href="/docs/gatsby">
            <a className={s.useCaseCard}>
              <div className={s.useCaseCardTitle}>Gatsby</div>
              <p>Learn how to integrate your Gatsby website with DatoCMS</p>
            </a>
          </Link>
          <Link href="/docs/hugo">
            <a className={s.useCaseCard}>
              <div className={s.useCaseCardTitle}>Hugo</div>
              <p>Learn how to integrate your Hugo website with DatoCMS</p>
            </a>
          </Link>
        </div>
      </div>
    </DocsLayout>
  );
}
