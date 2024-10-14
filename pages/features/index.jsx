import { useGSAP } from '@gsap/react';
import Button from 'components/Button';
import Head from 'components/Head';
import { highlightStructuredText } from 'components/Highlight';
import Layout from 'components/Layout';
import Wrapper from 'components/Wrapper';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import {
  featureCardFields,
  gqlStaticProps,
  imageFields,
  partnerTestimonialFields,
  reviewFields,
  seoMetaTagsFields,
} from 'lib/datocms';
import Link from 'next/link';
import ChevronDown from 'public/icons/regular/chevron-down.svg';
import { useRef } from 'react';
import {
  Image as DatoImage,
  StructuredText,
  renderMetaTags,
} from 'react-datocms';
import slugify from 'utils/slugify';
import s from './style.module.css';

gsap.registerPlugin(ScrollTrigger);

export const getStaticProps = gqlStaticProps(
  /* GraphQL */
  `
    {
      page: featuresIndex {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
        title {
          value
        }
        subtitle {
          value
        }
        heroImageLeft {
          responsiveImage {
            ...imageFields
          }
        }
        heroImageRight {
          responsiveImage {
            ...imageFields
          }
        }
        coreFeaturesBlocks {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
        editorExperienceBlocks {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
        developerExperienceBlocks {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
        imageVideoManagementBlocks {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
        localizationBlocks {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
        extensibilityBlocks {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
        contentIntegrityBlocks {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
        governanceAndComplianceBlocks {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
        securityAndInfrastructureBlocks {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
      }
    }
    ${seoMetaTagsFields}
    ${imageFields},
    ${featureCardFields},
    ${reviewFields},
    ${partnerTestimonialFields}
  `,
  {
    requiredKeys: ['page'],
  },
);

export const FeatureCard = ({ feature }) => {
  const titleMapping = {
    docs: 'Docs',
    guide: 'Guide',
    learn_more: 'Learn more',
    watch_demo: 'Watch demo',
  };

  const links = feature.links.map((link) => {
    const resolvedLinkTitle = titleMapping[link.linkTitle] || 'Learn more';

    switch (link.content.__typename) {
      case 'BlogPostRecord':
        return {
          url: `/blog/${link.content.slug}`,
          __typename: link.content.__typename,
          linkTitle: resolvedLinkTitle,
        };
      case 'ChangelogEntryRecord':
        return {
          url: `/product-updates/${link.content.slug}`,
          __typename: link.content.__typename,
          linkTitle: resolvedLinkTitle,
        };
      case 'DocPageRecord':
        return {
          url: `/docs/${link.content.parent[0].slug}/${link.content.slug}`,
          __typename: link.content.__typename,
          linkTitle: resolvedLinkTitle,
        };
      case 'FeatureRecord':
        return {
          url: `/features/${link.content.slug}`,
          __typename: link.content.__typename,
          linkTitle: resolvedLinkTitle,
        };
      case 'PluginRecord':
        return {
          url: `/marketplace/plugins/i/${link.content.packageName}`,
          __typename: link.content.__typename,
          linkTitle: resolvedLinkTitle,
        };
      case 'TemplateDemoRecord':
        return {
          url: `/marketplace/starters/${link.content.code}`,
          __typename: link.content.__typename,
          linkTitle: resolvedLinkTitle,
        };
      case 'UserGuidesVideoRecord':
        return {
          url: `/user-guides/${link.content.parent[0].slug}/${link.content.slug}`,
          __typename: link.content.__typename,
          linkTitle: resolvedLinkTitle,
        };
      default:
        return {
          url: '/',
          __typename: link.content.__typename,
          linkTitle: resolvedLinkTitle,
        };
    }
  });

    return (
      <div className={s.feature}>
        {feature.image && (
          <figure className={s.featureImage}>
            <DatoImage data={feature.image.responsiveImage} />
          </figure>
        )}
        <article>
          <h3 className={s.featureTitle}>{feature.title}</h3>
          <div className={s.featureDescription}>
            <StructuredText data={feature.description} />
          </div>

          {links.length > 0 && (
            <div className={s.featureLinks}>
              {links.map((link, i) => (
                <div key={i}>
                  <Link key={i} href={link.url} passHref>
                    <a data-type={link.__typename} className={s.link}>
                      {link.linkTitle}
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    );
};

export const TestimonialCard = ({ feature }) => {
    return (
      <div className={s.quoteWrapper}>
        <div className={s.quote}>
          {highlightStructuredText(feature.testimonial.quote)}
        </div>
        <div className={s.content}>
          <DatoImage
            className={s.avatar}
            data={feature.testimonial.image.responsiveImage}
          />
          {feature.testimonial.partner ? (
            <Link
              href={`/partners/${feature.testimonial.partner.slug}`}
              passHref
            >
              <div className={s.authorRole}>
                <div className={s.name}>{feature.testimonial.name}</div>
                <div className={s.role}>
                  {feature.testimonial.role} @{' '}
                  {feature.testimonial.partner.name}
                </div>
              </div>
            </Link>
          ) : (
            <div className={s.authorRole}>
              <div className={s.name}>{feature.testimonial.name}</div>
              <div className={s.role}>{feature.testimonial.role}</div>
            </div>
          )}
        </div>
      </div>
    );
};

export default function Features({ page, preview }) {
  const sectionsRef = useRef([]);
  const anchorsRef = useRef([]);
  const currentAnchorRef = useRef(null);

  const {
    coreFeaturesBlocks,
    editorExperienceBlocks,
    developerExperienceBlocks,
    imageVideoManagementBlocks,
    localizationBlocks,
    extensibilityBlocks,
    contentIntegrityBlocks,
    governanceAndComplianceBlocks,
    securityAndInfrastructureBlocks,
  } = page;

  const featuresGroup = [
    {
      title: 'Core Features',
      features: coreFeaturesBlocks,
    },
    {
      title: 'Editor Experience',
      features: editorExperienceBlocks,
    },
    {
      title: 'Developer Experience',
      features: developerExperienceBlocks,
    },
    {
      title: 'Image & Video Management',
      features: imageVideoManagementBlocks,
    },
    {
      title: 'Localization',
      features: localizationBlocks,
    },
    {
      title: 'Extensibility',
      features: extensibilityBlocks,
    },
    {
      title: 'Content Integrity',
      features: contentIntegrityBlocks,
    },
    {
      title: 'Governance & Compliance',
      features: governanceAndComplianceBlocks,
    },
    {
      title: 'Security & Infrastructure',
      features: securityAndInfrastructureBlocks,
    },
  ];

  useGSAP(() => {
    sectionsRef.current.forEach((section, index) => {
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => updateCurrentSection(index),
        onEnterBack: () => updateCurrentSection(index),
        // markers: true, // check the trigger position
      });
    });
  }, []);

  const updateCurrentSection = (index) => {
    anchorsRef.current.forEach((anchor, i) => {
      if (i === index) {
        anchor.classList.add(s.active);
      } else {
        anchor.classList.remove(s.active);
      }
    });

    if (currentAnchorRef.current) {
      currentAnchorRef.current.textContent = featuresGroup[index].title;
    }
  };

  const assignSectionRef = (el, i) => {
    sectionsRef.current[i] = el;
  };

  const assignAsideRef = (el, i) => {
    anchorsRef.current[i] = el
  }

  return (
    <Layout preview={preview}>
      <Head>{renderMetaTags(page.seo)}</Head>

      <Wrapper>
        <div className={s.hero}>
          <div className={s.heroBody}>
            <h1 className={s.heroTitle}>
              {highlightStructuredText(page.title)}
            </h1>
            <div className={s.heroSubtitle}>
              {highlightStructuredText(page.subtitle)}
            </div>
            <div className={s.buttonContainer}>
              <Button as="a" href="https://dashboard.datocms.com/signup">
                Try it for free
              </Button>
              <Button as="a" s="invert" href="/contact">
                Contact sales
              </Button>
            </div>
          </div>
          <div className={s.heroImageWrapper}>
            {page.heroImageLeft?.responsiveImage &&
            page.heroImageRight?.responsiveImage ? (
              <>
                <div className={s.heroImage}>
                  <DatoImage data={page.heroImageLeft.responsiveImage} />
                </div>
                <div className={s.heroImage}>
                  <DatoImage data={page.heroImageRight.responsiveImage} />
                </div>
              </>
            ) : (
              page.heroImage?.responsiveImage && (
                <DatoImage data={page.heroImage.responsiveImage} />
              )
            )}
          </div>
        </div>
      </Wrapper>

      <Wrapper>
        <div className={s.features}>
          <aside className={s.aside}>
            <div className={s.asideAnchorsWrapper}>
              <div className={s.currentAnchor}>
                <span ref={currentAnchorRef}>Scroll to</span>
                <div className={s.currentAnchorArrow}>
                  <ChevronDown />
                </div>
              </div>

              <div className={s.asideAnchors}>
                <ul>
                  {featuresGroup.map(({ title }, i) => (
                    <li key={i}>
                      <a
                        href={`#${slugify(title)}`}
                        ref={(item) => assignAsideRef(item, i)}
                      >
                        {title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <div className={s.main}>
            {featuresGroup.map(({ title, features }, i) => {
              return (
                <div
                  key={i}
                  className={s.section}
                  id={slugify(title)}
                  ref={(item) => assignSectionRef(item, i)}
                >
                  <h2 className={s.sectionTitle}>{title}</h2>
                  <div className={s.blocks}>
                    {features.map((feature, i) => {
                      if (feature.__typename === 'FeatureRegularCardRecord') {
                        return <FeatureCard key={i} feature={feature} />;
                      }
                      if (feature.__typename === 'TestimonialCardRecord') {
                        return <TestimonialCard key={i} feature={feature} />;
                      }
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}
