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
        coreFeature {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
        editorExperienceFeature {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
        developerExperienceFeature {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
        imageVideoManagementFeature {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
        localizationFeature {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
        extensibilityFeature {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
        contentIntegrityFeature {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
        governanceAndComplianceFeature {
          __typename
          ...featureCardFields
          ... on TestimonialCardRecord {
            testimonial {
              ...partnerTestimonialFields
              ...reviewFields,
            }
          }
        }
        securityAndInfrastructureFeature {
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

  if (feature.__typename === 'FeatureRegularCardRecord') {
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
  }
};

export const TestimonialCard = ({ feature }) => {
  if (feature.__typename === 'TestimonialCardRecord') {
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
  }
};

export default function Features({ page, preview }) {
  const asideRef = useRef(null);
  const sectionsRef = useRef([]);
  const currentAnchorRef = useRef(null);

  const {
    coreFeature,
    editorExperienceFeature,
    developerExperienceFeature,
    imageVideoManagementFeature,
    localizationFeature,
    extensibilityFeature,
    contentIntegrityFeature,
    governanceAndComplianceFeature,
    securityAndInfrastructureFeature,
  } = page;

  const featuresGroup = [
    {
      title: 'Core Feature',
      features: coreFeature,
    },
    {
      title: 'Editor Experience',
      features: editorExperienceFeature,
    },
    {
      title: 'Developer Experience',
      features: developerExperienceFeature,
    },
    {
      title: 'Image & Video Management',
      features: imageVideoManagementFeature,
    },
    {
      title: 'Localization',
      features: localizationFeature,
    },
    {
      title: 'Extensibility',
      features: extensibilityFeature,
    },
    {
      title: 'Content Integrity',
      features: contentIntegrityFeature,
    },
    {
      title: 'Governance & Compliance',
      features: governanceAndComplianceFeature,
    },
    {
      title: 'Security & Infrastructure',
      features: securityAndInfrastructureFeature,
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
    const links = asideRef.current.querySelectorAll('a');
    for (const link of links) {
      link.classList.remove(s.active);
    }
    links[index]?.classList.add(s.active);
    if (currentAnchorRef.current) {
      currentAnchorRef.current.textContent = featuresGroup[index].title;
    }
  };

  const assignSectionRef = (el, i) => {
    sectionsRef.current[i] = el;
  };

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
          <aside className={s.aside} ref={asideRef}>
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
                      <a href={`#${slugify(title)}`}>{title}</a>
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
                  ref={(el) => assignSectionRef(el, i)}
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
