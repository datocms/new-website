import s from './style.css';

const areas = [
  {
    title: 'General concepts',
    children: [
      'Introduction',
      'API-first',
      'One account, multiple projects',
      'Building the content schema',
      'Organizing content',
      'Roles and permissions',
      'Collaboration features',
      'Localization',
      'Record versioning',
      'Draft/published system',
      'Media Area',
      'Working with images',
      'Video encoding/streaming',
      'Webhooks',
      'Plugins',
      'DatoCMS Site Search',
      'How to deploy your static website',
      'Plans, pricing and billing',
      'Transfer, duplicate or delete project',
    ],
  },

  {
    title: 'Content modelling',
    children: [
      'Single instance models',
      'Tree-like collections',
      'Link fields',
      'Modular content fields',
      'Slugs and permalinks',
      'Data migration',
    ],
  },

  {
    title: 'Content Delivery API',
    children: [
      'Introduction',
      'API Endpoint',
      'Query Explorer',
      'Authentication',
      'Rate limiting',
      'Your first request',
      'How to fetch records',
      'Pagination',
      'Filtering records',
      'Ordering records',
      'Localization',
      'Modular-content',
      'Tree-like collections',
      'Assets',
      'SEO and site favicon',
    ],
  },

  {
    title: 'Images',
    children: [
    ]
  },

  {
    title: 'Video streaming',
    children: [
    ]
  },

  { title: 'Site search', children: [] },
  { title: 'Plugins SDK', children: [] },
  {
    title: 'Integration guides',
    children: [
      // Frontend frameworks
      // Deployment methods
    ],
  },

  // react
  // nextjs
  // gatsbyjs
  // hugo
  // jekyll
  // metalsmith
  // middleman

  // circleci
  // gitlab
  // netlify
  // travis
  // custom-webhook
];

// 'Configuring Single Sign-On',
//   'Custom assets storage',
//   'Private videos',
//   'Offline backups',
export default function Docs() {
  return (
    <div className={s.root}>
      <div className={s.sidebar}>
        <div className={s.logo}>DatoCMS Docs</div>
        <div className={s.innerSidebar}>
          {areas.map(area => (
            <div className={s.area} key={area.title}>
              <div className={s.areaName}>{area.title}</div>
              {area.children.map(sub => (
                <div className={s.sub} key={sub}>
                  {sub}
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
