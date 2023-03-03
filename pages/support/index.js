import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import { gqlStaticProps } from 'lib/datocms';
import { useState, useEffect } from 'react';
import s from './style.module.css';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import TalkWithUs from 'components/TalkWithUs';
import Hashicorp from 'public/images/logos/hashicorp.svg';
import DeutscheTelekom from 'public/images/logos/deutsche-telekom.svg';
import Verizon from 'public/images/logos/verizon.svg';
import Nike from 'public/images/logos/nike.svg';
import Vercel from 'public/images/logos/vercel.svg';
import LogosBar from 'components/LogosBar';
import { useRouter } from 'next/router';
import scrollIntoView from 'scroll-into-view-if-needed';
import Head from 'components/Head';
import { StructuredText } from 'react-datocms';

export const getStaticProps = gqlStaticProps(
  /* GraphQL */
  `
    {
      topics: allSupportTopics(first: 60) {
        slug
        title
        parent {
          slug
        }
        subtopicQuestion
        commonQuestions {
          title
          url
        }
        disableContactForm
        contactFormType
        autoResponderType
        description {
          value
        }
        children {
          slug
        }
      }
    }
  `,
);

export default function Support({ preview, topics }) {
  const router = useRouter();
  const [formVisible, setFormVisible] = useState(false);

  const selectedTopicSlugs = (router.query.topics || '').split('/');
  const { email, errorId, projectUrl } = router.query;

  const setSelectedTopicSlugs = (slugs) => {
    const url = `/support?topics=${slugs.join('/')}`;
    router.push(url, url, {
      shallow: true,
    });
  };

  const rootTopicSlug = selectedTopicSlugs[0];
  const rootTopics = topics.filter((t) => !t.parent);
  const rootTopic =
    rootTopicSlug && topics.find((t) => t.slug === rootTopicSlug);
  const subTopics =
    rootTopic &&
    rootTopic.children.map((x) => topics.find((t) => t.slug === x.slug));
  const leafTopic =
    selectedTopicSlugs.length > 0 &&
    topics.find(
      (t) => t.slug === selectedTopicSlugs[selectedTopicSlugs.length - 1],
    );

  const handleChange = (level, event) => {
    const topicSlug = event.target.value;

    setFormVisible(false);

    if (level === 0) {
      setSelectedTopicSlugs([topicSlug]);
    }
    if (level === 1) {
      setSelectedTopicSlugs([selectedTopicSlugs[0], topicSlug]);
    }
  };

  useEffect(() => {
    if (formVisible) {
      scrollIntoView(document.getElementById('form'), {
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
    }
  }, [formVisible]);

  return (
    <Layout noCta preview={preview}>
      <Head noIndex>
        <title>Support page</title>
      </Head>

      <Wrapper>
        <Hero
          kicker="Support page"
          title={
            <>
              Got&nbsp;issues?
              <br />
              <Highlight>We&apos;re&nbsp;here to&nbsp;help!</Highlight>
            </>
          }
        />
        <div className={s.root}>
          <div className={s.picker}>
            <div className={s.topic}>
              <p className={s.topicLabel}>Topic:</p>
              <select
                className={s.topicSelect}
                autoComplete="off"
                value={selectedTopicSlugs[0] || 'empty'}
                onChange={handleChange.bind(null, 0)}
              >
                <option value="empty" disabled>
                  Please select a topic...
                </option>
                {rootTopics.map((topic) => (
                  <option value={topic.slug} key={topic.slug}>
                    {topic.title}
                  </option>
                ))}
              </select>
            </div>
            {subTopics && subTopics.length > 0 && (
              <div className={s.topic}>
                <p className={s.topicLabel}>{rootTopic.subtopicQuestion}</p>
                <select
                  className={s.topicSelect}
                  value={selectedTopicSlugs[1] || 'empty'}
                  onChange={handleChange.bind(null, 1)}
                >
                  <option value="empty" disabled>
                    Please select a topic...
                  </option>
                  {subTopics.map((topic) => (
                    <option value={topic.slug} key={topic.slug}>
                      {topic.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          {leafTopic &&
            (leafTopic.commonQuestions.length > 0 ||
              (leafTopic.description &&
                toPlainText(leafTopic.description).length > 0)) && (
              <div className={s.description}>
                <StructuredText data={leafTopic.description} />
                {leafTopic.commonQuestions.length > 0 && (
                  <>
                    <h3>Popular guides and tutorials</h3>
                    <p>
                      Please take a look at these resources, as they might
                      probably be the fastest way to solve your issue!
                    </p>
                    <ul>
                      {leafTopic.commonQuestions.map((q) => (
                        <li id={q.url} key={q.url}>
                          <a href={q.url}>{q.title}</a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {leafTopic &&
                  leafTopic.children.length === 0 &&
                  !leafTopic.disableContactForm && (
                    <>
                      <h3>Didn&#39;t find what you&#39;re looking for?</h3>
                      <ul>
                        <li>
                          <a
                            href="#form"
                            onClick={(e) => {
                              e.preventDefault();
                              setFormVisible(true);
                              const el = document.getElementById('form');
                              if (el) {
                                scrollIntoView(el, {
                                  behavior: 'smooth',
                                  block: 'start',
                                  inline: 'start',
                                });
                              }
                            }}
                          >
                            Access our contact form
                          </a>
                        </li>
                      </ul>
                    </>
                  )}
              </div>
            )}
          {leafTopic &&
            leafTopic.children.length === 0 &&
            ((leafTopic.commonQuestions.length === 0 &&
              !leafTopic.disableContactForm) ||
              (leafTopic.commonQuestions.length > 0 && formVisible)) && (
              <div className={s.talkWithUs} id="form">
                <div className={s.talkWithUsInner}>
                  <div className={s.talkWithUsIntro}>
                    <div className={s.talkWithUsTitle}>Talk with us!</div>
                    <div className={s.talkWithUsDescription}>
                      Our experts are available to answer any of your questions.
                      We’re available in a number of ways, any time that you
                      need us.
                    </div>
                  </div>
                  <div className={s.form}>
                    <TalkWithUs
                      initialValues={{
                        email,
                        errorId,
                        project: projectUrl,
                        issueType: leafTopic.autoResponderType,
                      }}
                      fieldset={leafTopic.contactFormType}
                      hubspotFormId={
                        leafTopic.contactFormType === 'sales'
                          ? '11eae68a-59d8-4c94-b503-a373cb490a61'
                          : leafTopic.contactFormType === 'support'
                          ? 'e29ac953-aed2-4318-b2a4-8eb02bab22ba'
                          : undefined
                      }
                    />
                  </div>
                </div>
              </div>
            )}
        </div>
      </Wrapper>
      <div className={s.footer}>
        <LogosBar
          title="We power experiences for over half a billion users"
          clients={[
            <DeutscheTelekom key="DeutscheTelekom" />,
            <Hashicorp key="Hashicorp" />,
            <Verizon key="Verizon" />,
            <Nike key="Nike" />,
            <Vercel key="Vercel" />,
          ]}
        />
      </div>
    </Layout>
  );
}
