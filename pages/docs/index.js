import { gqlStaticProps } from 'lib/datocms';
import DocsLayout from 'components/DocsLayout';
import gql from 'graphql-tag';
import Link from 'next/link';
import s from './style.css';

export const unstable_getStaticProps = gqlStaticProps(
  gql`
    query {
      roots: allDocGroups(filter: { parent: { exists: false } }) {
        name
        slug
        pages {
          title
          slug
        }
        children {
          name
          slug
          pages {
            title
            slug
          }
          children {
            name
            slug
            pages {
              title
              slug
            }
          }
        }
      }
    }
  `,
);

export default function Docs({ roots }) {
  return (
    <DocsLayout
      sidebar={
        <>
          {roots.map(root =>
            root.children.length === 0 ? (
              <Link
                href="/docs/p/[...chunks]"
                as={`/docs/p/${root.slug}/${root.pages[0].slug}`}
              >
                <a className={s.topGuide} key={root.slug}>
                  {root.name}
                </a>
              </Link>
            ) : (
              <div className={s.group} key={root.slug}>
                <div className={s.groupName}>{root.name}</div>
                <div className={s.guides}>
                  {root.children.map(sub => (
                    <Link
                      href="/docs/p/[...chunks]"
                      as={`/docs/p/${sub.slug}/${sub.pages[0].slug}`}
                      key={sub.slug}
                    >
                      <a className={s.guide}>{sub.name}</a>
                    </Link>
                  ))}
                </div>
              </div>
            ),
          )}
        </>
      }
    />
  );
}
