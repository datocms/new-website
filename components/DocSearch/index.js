import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import DatoCmsSearch from 'datocms-search/dist/datocms-search.base';
import highlighter from 'keyword-highlighter';
import cn from 'classnames';
import parse from 'html-react-parser';

import s from './style.module.css';

const client = new DatoCmsSearch('d46fe8134ea916b42af4eaa0d06109');

const fetchCommunity = async query => {
  const endpoint = 'https://community.datocms.com/search/query.json';

  const { topics, posts } = await ky
    .get(`${endpoint}?include_blurbs=true&term=${encodeURIComponent(query)}`)
    .json();

  if (!posts) {
    return [];
  }

  return posts.map(post => {
    const topic = topics.find(t => t.id === post.topic_id);
    return {
      title: highlighter(query || '', topic.title),
      body: highlighter(query || '', post.blurb),
      url: `https://community.datocms.com/t/${topic.slug}/${topic.id}`,
      community: true,
    };
  });
};

const search = async query => {
  const [{ results: docs }, community] = await Promise.all([
    client.search(query),
    fetchCommunity(query),
  ]);

  return [].concat(docs, community);
};

export default function DocSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);

      search(debouncedSearchTerm).then(results => {
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
        <ul className={s.results}>
          {results.map(result => (
            <li key={result.url} className={s.result}>
              <a href={result.url}>
                <div className={s.resultTitle}>
                  {parse(result.title.replace(/ - DatoCMS$/, ''))}{' '}
                  {result.community && (
                    <span className={s.community}>Community</span>
                  )}
                </div>
                {result.body && (
                  <div
                    className={s.resultBody}
                    dangerouslySetInnerHTML={{ __html: result.body }}
                  />
                )}
                <div
                  className={s.resultUrl}
                  dangerouslySetInnerHTML={{
                    __html: highlighter(searchTerm || '', result.url),
                  }}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <form className={s.formSearch}>
        <input
          name="query"
          type="search"
          placeholder="Search in the docs and community..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </form>
    </>
  );
}
