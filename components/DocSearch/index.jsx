import cn from 'classnames';
import DatoCmsSearch from 'datocms-search/dist/datocms-search.base';
import parse from 'html-react-parser';
import highlighter from 'keyword-highlighter';
import Hamburger from 'public/icons/regular/bars.svg';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import wretch from 'wretch';

import s from './style.module.css';

const client = new DatoCmsSearch('d46fe8134ea916b42af4eaa0d06109');

const fetchCommunity = async (query) => {
  const endpoint = 'https://community.datocms.com/search/query.json';

  try {
    const { topics, posts } = await wretch(
      `${endpoint}?include_blurbs=true&term=${encodeURIComponent(query)}`,
    )
      .get()
      .json();

    if (!posts) {
      return [];
    }

    return posts.map((post) => {
      const topic = topics.find((t) => t.id === post.topic_id);
      return {
        title: highlighter(query || '', topic.title),
        body: highlighter(query || '', post.blurb),
        url: `https://community.datocms.com/t/${topic.slug}/${topic.id}`,
      };
    });
  } catch (error) {
    console.error(`Error seaching the DatoCMS forum: ${error}`);
    return [];
  }
};

const search = async (query) => {
  const [{ results: docs }, community] = await Promise.all([
    client.search(query),
    fetchCommunity(query),
  ]);

  const resultsByArea = {};
  const urls = [];

  for (const result of [...docs, ...community]) {
    console.log('cerco', JSON.stringify(result.url), urls);
    if (urls.includes(result.url)) {
      continue;
    }

    console.log('non trovato');
    urls.push(result.url);

    const areas = [
      { match: '/user-guides', area: 'user_guides' },
      { match: '/academy', area: 'academy' },
      { match: '/docs/scripting-migrations', area: 'environments' },
      { match: '/docs/general-concepts', area: 'general_concepts' },
      { match: '/docs/content-modelling', area: 'content_modelling' },
      { match: '/docs/nuxt', area: 'nuxt' },
      { match: '/docs/next-js', area: 'nextjs' },
      { match: '/docs/remix', area: 'remix' },
      { match: '/docs/svelte', area: 'svelte' },
      { match: '/docs/sveltekit', area: 'sveltekit' },
      { match: '/docs/react', area: 'react' },
      { match: '/docs/vue', area: 'vue' },
      { match: '/docs/content-delivery-api', area: 'cda' },
      { match: '/docs/content-management-api', area: 'cma' },
      { match: '/docs/plugin-sdk', area: 'plugin_sdk' },
      { match: '/docs', area: 'docs' },
      { match: '/blog', area: 'blog' },
      { match: '/product-updates', area: 'product_updates' },
      { match: 'https://community.datocms.com', area: 'community' },
    ];

    const foundArea = areas.find((a) => result.url.includes(a.match));
    const area = foundArea ? foundArea.area : 'other';

    resultsByArea[area] = resultsByArea[area] || [];
    resultsByArea[area].push(result);
  }

  console.log(resultsByArea);

  return resultsByArea;
};

const areas = [
  { id: 'general-concepts', label: 'General Concepts' },
  { id: 'user_guides', label: 'User Guides' },
  { id: 'academy', label: 'Headless CMS Academy' },
  { id: 'content-modelling', label: 'Content Modelling' },
  { id: 'environments', label: 'Environments and Migrations Guide' },
  { id: 'cda', label: 'Content Delivery API Reference' },
  { id: 'cma', label: 'Content Management API Reference' },
  { id: 'plugin_sdk', label: 'Plugin SDK' },
  { id: 'nuxt', label: 'Nuxt Integration Guide' },
  { id: 'nextjs', label: 'Next Integration Guide.js' },
  { id: 'remix', label: 'Remix Integration Guide' },
  { id: 'svelte', label: 'Svelte Integration Guide' },
  { id: 'sveltekit', label: 'SvelteKit Integration Guide' },
  { id: 'react', label: 'React Integration Guide' },
  { id: 'vue', label: 'Vue Integration Guide' },
  { id: 'docs', label: 'Documentation' },
  { id: 'blog', label: 'Blog' },
  { id: 'product_updates', label: 'Product Updates' },
  { id: 'other', label: 'Elsewhere on the website' },
  { id: 'community', label: 'Community' },
];

export default function DocSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);

      search(debouncedSearchTerm).then((results) => {
        setIsSearching(false);
        setResults(results);
      });
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <>
      <div
        className={cn(s.overlay, { [s.visible]: !!searchTerm })}
        onClick={() => setSearchTerm('')}
      />
      <div className={cn(s.searchResults, { [s.visible]: !!searchTerm })}>
        {isSearching && (
          <div className={s.spinning}>
            <div />
            <div />
          </div>
        )}
        <div className={s.results}>
          {areas.map((area) => {
            if (!results[area.id]) {
              return null;
            }

            return (
              <div key={area.id} className={s.area}>
                <div className={s.areaTitle}>{area.label}</div>
                {results[area.id].map((result) => (
                  <a href={result.url} key={result.url} className={s.result}>
                    <div>
                      <Hamburger />
                    </div>
                    <div>
                      <div className={s.resultTitle}>
                        {parse(
                          (result.title || '').replace(/ [—|-] DatoCMS.*$/, ''),
                        )}{' '}
                      </div>
                      {result.body && (
                        <div
                          className={s.resultBody}
                          dangerouslySetInnerHTML={{ __html: result.body }}
                        />
                      )}
                    </div>
                  </a>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <form className={s.formSearch}>
        <input
          name="query"
          type="search"
          placeholder="Search in the docs and community..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
    </>
  );
}
