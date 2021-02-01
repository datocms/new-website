import { gqlStaticProps } from 'lib/datocms';
import DocsLayout from 'components/DocsLayout';
import { Sidebar } from 'pages/docs/[...chunks]';
import Head from 'next/head';
import s from 'pages/docs/pageStyle.module.css';
import Anchor from 'public/icons/regular/link.svg';
import { StructuredText } from 'react-datocms';

export const getStaticProps = gqlStaticProps(
  `
    {
      tutorials: allTutorials {
        title
        url
        excerpt { value }
      }
    }
  `,
);

export default function Tutorials({ tutorials }) {
  return (
    <DocsLayout
      sidebar={
        <Sidebar
          title="Community tutorials"
          entries={[
            {
              url: '/docs/community-tutorials',
              label: 'Tutorials',
            },
          ]}
        />
      }
    >
      <Head>
        <title>Community tutorials</title>
      </Head>
      <div className={s.articleContainer}>
        <div className={s.article}>
          <div className={s.title}>Community tutorials</div>

          <div className={s.tutorials}>
            {tutorials.map((tutorial) => (
              <a href={tutorial.url} key={tutorial.url} className={s.tutorial}>
                <h6 className={s.tutorialTitle}>
                  {tutorial.title} <Anchor />
                </h6>
                <div className={s.tutorialDescription}>
                  <StructuredText data={tutorial.excerpt} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
