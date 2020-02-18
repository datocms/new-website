import glob from 'glob';
import util from 'util';
import buildTree from 'utils/buildTree';

import s from './style.css';

export async function unstable_getStaticProps() {
  const result = await util.promisify(glob)('docs/**/*.md');
  const toc = await buildTree(result);

  return { props: { toc } };
}

export default function Docs({ toc }) {
  return (
    <div className={s.root}>
      <div className={s.sidebar}>
        <div className={s.logo}>DatoCMS Docs</div>
        <div className={s.innerSidebar}>
          {toc.map(item => (
            <div className={s.area} key={item.title}>
              <div className={s.areaName}>{item.title}</div>
              {item.children.map(sub => (
                <div className={s.sub} key={sub}>
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
  );
}
