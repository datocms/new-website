import { gqlStaticProps } from 'lib/datocms';
import DocsLayout from 'components/DocsLayout';
import gql from 'graphql-tag';
import Link from 'next/link';
import s from './style.css';
import useSWR from 'swr';
import fetch from 'unfetch';
import cn from 'classnames';

export const unstable_getStaticProps = gqlStaticProps(
  gql`
    query {
      roots: allDocGroups(filter: { parent: { exists: false } }) {
        name
        slug
        pages {
          page {
            slug
          }
        }
        children {
          name
          slug
          pages {
            page {
              slug
            }
          }
          children {
            name
            slug
            pages {
              page {
                slug
              }
            }
          }
        }
      }
    }
  `,
);

async function topicsFetcher() {
  const response = await fetch('https://community.datocms.com/categories.json');
  const body = await response.json();
  return body.category_list.categories;
}

async function statusFetcher() {
  const response = await fetch(
    'https://status.datocms.com/.netlify/functions/componentsStatus?days=1',
  );
  const body = await response.json();
  return body;
}

const Sidebar = ({ roots }) => (
  <>
    {roots.map(root =>
      root.children.length === 0 ? (
        <Link
          key={root.slug}
          href="/docs/p/[...chunks]"
          as={`/docs/p/${root.slug}${
            root.pages[0].slug === 'index' ? '' : `/${root.pages[0].page.slug}`
          }`}
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
                as={`/docs/p/${sub.slug}${
                  sub.pages[0].slug === 'index' ? '' : `/${sub.pages[0].page.slug}`
                }`}
                key={sub.slug}
              >
                <a className={s.guide}>{sub.name}</a>
              </Link>
            ))}
          </div>
        </div>
      ),
    )}
    <div className={s.group}>
      <div className={s.groupName}>API Reference</div>
      <div className={s.guides}>
        <Link href="/docs/reference/cda">
          <a className={s.guide}>
            Content Delivery API
          </a>
        </Link>
        <Link href="/docs/reference/cma">
          <a className={s.guide}>
            Content Management API
          </a>
        </Link>
      </div>
    </div>
    <div className={s.group}>
      <div className={s.groupName}>Community</div>
      <div className={s.guides}>
        <a className={s.guide} href="https://community.datocms.com/">
          DatoCMS Community
        </a>
      </div>
    </div>
  </>
);

export default function Docs({ roots }) {
  const { data: categories } = useSWR('topics', topicsFetcher);
  const { data: components } = useSWR('components', statusFetcher);

  return (
    <DocsLayout sidebar={<Sidebar roots={roots} />}>
      <div className={s.blocks}>
        <div className={s.block}>
          <a href="https://community.datocms.com/" className={s.blockBody}>
            <div className={s.blockReadMore}>Ask a question</div>
          </a>

          <div className={s.blockItems}>
            <div className={s.blockItemsTitle}>
              Browse our forum channels...
            </div>
            {[
              ['18', 'General channel'],
              ['22', 'Suggest a new feature'],
              ['13', 'REST and GraphQL APIs'],
              ['5', 'Integrate with other tools'],
              ['16', 'Propose & request plugins'],
            ].map(([id, label]) => {
              const category =
                categories &&
                categories.find(({ id: x }) => x.toString() === id);
              return (
                <a
                  key={id}
                  className={s.blockItem}
                  href={`https://community.datocms.com/c/${category &&
                    category.slug}`}
                >
                  <span className={s.blockItemMain}>
                    <span
                      className={s.blockItemCircle}
                      style={
                        category && {
                          backgroundColor: `#${category.color}`,
                        }
                      }
                    />
                    {label}
                  </span>
                  {category && category.topics_all_time > 1 && (
                    <span className={s.blockItemDetail}>
                      {category.topics_all_time} discussions
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        </div>
        <div className={s.block}>
          <a href="https://status.datocms.com" className={s.blockBody}>
            <div className={s.blockReadMore}>Visit Status page</div>
          </a>
          <div className={s.blockItems}>
            <div className={s.blockItemsTitle}>System components</div>
            {[
              ['cda', 'Content Delivery API'],
              ['cma', 'Content Management API'],
              ['assets', 'Assets CDN'],
              ['administrativeAreas', 'Administrative interface'],
              ['dashboard', 'Dashboard interface'],
            ].map(([id, label]) => {
              const component =
                components && components.find(({ id: x }) => x === id);
              const status = component ? component.status : 'loading';
              const statusLabel = {
                up: 'Operational',
                down: 'Down',
                loading: 'Checking...',
              };
              return (
                <div key={id} className={s.blockItem}>
                  <span className={s.blockItemMain}>{label}</span>
                  <span
                    className={cn(s.blockItemDetail, {
                      [s[`${status}Status`]]: true,
                    })}
                  >
                    {statusLabel[status]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
