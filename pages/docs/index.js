import { gqlStaticProps } from 'lib/datocms';
import BaseLayout from 'components/BaseLayout';
import gql from 'graphql-tag';

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
    <BaseLayout>
      <div className={s.root}>
        <div className={s.sidebar}>
          <div className={s.logo}>DatoCMS Docs</div>
          <div className={s.innerSidebar}>
            {roots.map(root => (
              <div className={s.area} key={root.slug}>
                <div className={s.areaName}>{root.name}</div>
                {root.children.map(sub => (
                  <div className={s.sub} key={sub.slug}>
                    {sub.name}
                  </div>
                ))}
                {root.pages.map(sub => (
                  <div className={s.sub} key={sub.slug}>
                    {sub.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={s.contentWrapper}>
          <div className={s.mainHeader}></div>
          <div className={s.articleContainer}></div>
        </div>
      </div>
    </BaseLayout>
  );
}
