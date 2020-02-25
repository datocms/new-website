import DocsLayout from 'components/DocsLayout';
import {
  Sidebar,
  unstable_getStaticProps as docPageUnstableGetStaticProps,
} from 'pages/docs/p/[...chunks]';
import s from 'pages/docs/pageStyle.css';
import fetchCma from 'utils/fetchCma';
import { parse } from 'flatted/cjs';
import { useMemo } from 'react';
import Head from 'next/head';
import CmaResourceAttributes from 'components/CmaResourceAttributes';
import CmaResourceMethod from 'components/CmaResourceMethod';
import r from 'pages/docs/resourceStyle.css';
import { useState } from 'react';
import cn from 'classnames';
import { renderMetaTags } from 'react-datocms';

export const unstable_getStaticPaths = async () => {
  const cma = await fetchCma();
  const { toc } = parse(cma);

  return { paths: toc.map(({ slug }) => ({ params: { resource: slug } })) };
};

export const unstable_getStaticProps = async ({ params: { resource } }) => {
  const { props } = await docPageUnstableGetStaticProps({
    params: { chunks: ['content-management-api', 'overview'] },
  });

  const cma = await fetchCma(resource);

  return { props: { ...props, cma } };
};

const LanguagePicker = ({ children }) => {
  const [language, setLanguage] = useState('http');

  return (
    <>
      <div className={r.picker}>
        <div className={r.pickerLabel}>Choose your language:</div>
        <button
          className={cn(r.pickerButton, {
            [r.pickerButtonActive]: language === 'http',
          })}
          onClick={() => setLanguage('http')}
        >
          HTTP
        </button>
        <button
          className={cn(r.pickerButton, {
            [r.pickerButtonActive]: language === 'javascript',
          })}
          onClick={() => setLanguage('javascript')}
        >
          Javascript
        </button>
        <button
          className={cn(r.pickerButton, {
            [r.pickerButtonActive]: language === 'ruby',
          })}
          onClick={() => setLanguage('ruby')}
        >
          Ruby
        </button>
      </div>
      {children(language)}
    </>
  );
};

export default function DocPage({ docGroup, page, cma }) {
  const result = useMemo(() => cma && parse(cma), [cma]);

  return (
    <DocsLayout
      sidebar={
        docGroup && (
          <Sidebar
            title={docGroup.name}
            entries={[].concat(
              docGroup.pages.map(page => {
                return {
                  url: `/docs/p/${docGroup.slug}${
                    page.page.slug === 'index' ? '' : `/${page.page.slug}`
                  }`,
                  label: page.titleOverride || page.page.title,
                };
              }),
              result.toc,
            )}
          />
        )
      }
    >
      {page && (
        <>
          <Head>
            {renderMetaTags(page._seoMetaTags)}
            <title>{result.schema.title} - Content Management API</title>
          </Head>
          <div className={s.articleContainer}>
            <div className={s.article}>
              <div className={s.title}>{result.schema.title}</div>
              <div className={s.body}>
                {result.schema.description}
                <CmaResourceAttributes resource={result.schema} />

                <h4>Available endpoints</h4>
                <ul>
                  {result.schema.links.map(link => (
                    <li key={link.rel}>
                      <a href={`#${link.rel}`}>{link.title}</a>
                    </li>
                  ))}
                </ul>
                <LanguagePicker>
                  {language =>
                    result.schema.links.map(link => (
                      <CmaResourceMethod
                        language={language}
                        key={link.title}
                        resource={result.schema}
                        link={link}
                      />
                    ))
                  }
                </LanguagePicker>
              </div>
            </div>
          </div>
        </>
      )}
    </DocsLayout>
  );
}
