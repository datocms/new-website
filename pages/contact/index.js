import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import cn from 'classnames';
import useSWR from 'swr';
import fetch from 'unfetch';
import s from './style.css';
import TalkWithUs from 'components/TalkWithUs';

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

export default function Support() {
  const { data: categories } = useSWR('topics', topicsFetcher);
  const { data: components } = useSWR('components', statusFetcher);

  return (
    <Layout>
      <Wrapper>
        <TalkWithUs />
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
      </Wrapper>
    </Layout>
  );
}
