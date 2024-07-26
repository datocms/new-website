import Head from 'components/Head';
import MarketplaceCard from 'components/MarketplaceCard';
import Layout from 'components/MarketplaceLayout';
import useEmblaCarousel from 'embla-carousel-react';
import { handleErrors, imageFields, request } from 'lib/datocms';
import Link from 'next/link';
import AngleLeft from 'public/icons/regular/angle-left.svg';
import AngleRight from 'public/icons/regular/angle-right.svg';
import ArrowRight from 'public/icons/regular/arrow-right.svg';
import Next from 'public/images/logos/next.svg';
import Nuxt from 'public/images/logos/nuxt.svg';
import Svelte from 'public/images/logos/svelte.svg';
import { useCallback, useEffect, useState } from 'react';
import tiny from 'tiny-json-http';
import { githubRepoToManifest } from 'utils/githubRepo';
import s from './style.module.css';

export const getStaticProps = handleErrors(async ({ preview }) => {
  const {
    data: { page, ...other },
  } = await request({
    query: `
      {
        demos: _allTemplateDemosMeta {
          count
        }
        plugins: _allPluginsMeta(
          filter: { manuallyDeprecated: { eq: false } }
        ) {
          count
        }
        hostingApps: _allHostingAppsMeta {
          count
        }
        enterpriseApps: _allEnterpriseAppsMeta {
          count
        }
        page: integrationsPage {
          demos {
            id
            code
            name
            cmsDescription
            starterType
            badge {
              name
              emoji
            }
            label
            githubRepo
            technology {
              name
              logo {
                url
              }
              squareLogo {
                url
              }
            }
            screenshot {
              responsiveImage(
                imgixParams: { auto: format, w: 600, h: 400, fit: crop }
              ) {
                ...imageFields
              }
            }
          }
          plugins {
            packageName
            coverImage {
              responsiveImage(imgixParams: { auto: format, w: 300, h: 200, fit: crop }) {
                ...imageFields
              }
            }
            title
            description
          }
          hostingBuilding {
            slug
            title
            description: shortDescription
            logo {
              url
              width
              height
            }
          }
          enterpriseApps {
            slug
            title
            description: shortDescription
            logo {
              url
              width
              height
            }
          }
        }
      }

      ${imageFields}
    `,
    preview,
  });

  page.demos = await Promise.all(
    page.demos.map(async (starter) => {
      const { body } = await tiny.get({
        url: githubRepoToManifest(starter.githubRepo),
      });
      return { ...JSON.parse(body), ...starter };
    }),
  );

  return {
    props: {
      preview: preview || false,
      page,
      ...other,
    },
  };
});

const Category = ({ title, description, children, browse }) => (
  <div className={s.category}>
    <div className={s.categoryIntro}>
      <div className={s.header}>
        <div className={s.headerTitle}>{title}</div>
        {browse}
      </div>
      {description && (
        <div className={s.intro}>
          <p>{description}</p>
        </div>
      )}
    </div>
    {children}
  </div>
);

function Carousel({ options, children }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [prevButtonDisabled, setPrevButtonDisabled] = useState(false);
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);

  const prevSlide = () => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  };

  const nextSlide = () => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  };

  const onSelect = useCallback((emblaApi) => {
    setPrevButtonDisabled(!emblaApi.canScrollPrev());
    setNextButtonDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('init', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <>
      <div className={s.controls}>
        <div
          className={`${s.prevSlide} ${prevButtonDisabled ? s.isDisabled : ''}`}
          onClick={prevSlide}
        >
          <AngleLeft />
        </div>
        <div
          className={`${s.nextSlide} ${nextButtonDisabled ? s.isDisabled : ''}`}
          onClick={nextSlide}
        >
          <AngleRight />
        </div>
      </div>
      <div className={s.embla} ref={emblaRef}>
        <div className={s.emblaContainer}>{children}</div>
      </div>
    </>
  );
}

export default function IntegrationsPage({
  page,
  plugins,
  hostingApps,
  enterpriseApps,
  preview,
}) {
  const fullFledged = page.demos.filter(
    (item) => item.starterType === 'fully_fledged',
  );
  const techStarters = page.demos.filter(
    (item) => item.starterType === 'tech_starter',
  );

  const carouselOptions = {
    loop: false,
    align: 'start',
  };

  return (
    <Layout preview={preview}>
      <Head>
        <title>Integrations Marketplace</title>
      </Head>

      <Category
        title="Our Starters"
        browse={
          <Link href="/marketplace/starters">
            <a className={s.headerViewAll}>
              <span>View all </span> <ArrowRight />
            </a>
          </Link>
        }
      >
        <div className={s.startersWrapper}>
          <div className={s.fullyFledged}>
            <div className={s.intro}>
              <h3>Fully fledged demos</h3>
              <p>
                Use our pre-built demo projects to see all of DatoCMS&apos;s
                features in a realistic production-ready setup. Includes many
                example content types, and advanced features.
              </p>
            </div>
            {fullFledged.map((item) => (
              <MarketplaceCard
                key={item.code}
                href={`/marketplace/starters/${item.code}`}
                image={item.screenshot.responsiveImage}
                technology={item.technology}
                text={{
                  title: item.name,
                  description: item.cmsDescription,
                }}
                highlight={'Best choice to start!'}
                badge={item.badge}
                label={item.label}
                size="large"
              />
            ))}
          </div>

          <div className={s.techStarters}>
            <div className={s.intro}>
              <h3>Tech starter kits</h3>
              <p>Kickstart your next project with our scaffolds.</p>
            </div>

            {techStarters.length ? (
              techStarters.map((item) => (
                <MarketplaceCard
                  key={item.code}
                  href={`/marketplace/starters/${item.code}`}
                  technology={item.technology.squareLogo}
                  text={{
                    title: item.name,
                    description: item.cmsDescription,
                  }}
                  boxed={false}
                  orientation="horizontal"
                  size="small"
                />
              ))
            ) : (
              <>
                <div className={s.comingsoon}>
                  <figure>
                    <Next />
                  </figure>
                  <p>Coming soon</p>
                </div>
                <div className={s.comingsoon}>
                  <figure>
                    <Nuxt />
                  </figure>
                  <p>Coming soon</p>
                </div>
                <div className={s.comingsoon}>
                  <figure>
                    <Svelte />
                  </figure>
                  <p>Coming soon</p>
                </div>
              </>
            )}
          </div>
        </div>
      </Category>

      <Category
        title="Community Plugins"
        browse={
          <Link href="/marketplace/plugins">
            <a className={s.headerViewAll}>
              <span>View all ({plugins.count})</span> <ArrowRight />
            </a>
          </Link>
        }
        description="Easily expand and customize the capabilities of DatoCMS with community plugins"
      >
        <div className={s.carouselWrapper}>
          <Carousel options={carouselOptions}>
            {page.plugins.map((item, index) => (
              <div key={index} className={s.emblaSlide}>
                <MarketplaceCard
                  href={`/marketplace/plugins/i/${item.packageName}`}
                  image={item.coverImage.responsiveImage}
                  technology={item.technology}
                  text={{
                    title: item.title,
                    description: item.description,
                  }}
                  badge={item.badge}
                  label={item.label}
                  size="medium"
                />
              </div>
            ))}
          </Carousel>
        </div>
      </Category>

      <Category
        title="Hosting &amp; CI Building"
        description="Server, serverless or static: no matter the stack you&#39;re using, we&#39;ve got you covered"
        browse={
          <Link href="/marketplace/hosting">
            <a className={s.headerViewAll}>
              <span>View all ({hostingApps.count})</span> <ArrowRight />
            </a>
          </Link>
        }
      >
        <div className={s.carouselWrapper}>
          <Carousel options={carouselOptions}>
            {page.hostingBuilding.map((item, index) => (
              <div key={index} className={s.emblaSlide}>
                <MarketplaceCard
                  href={`/marketplace/hosting/${item.slug}`}
                  technology={item.logo}
                  text={{
                    title: item.title,
                    description: item.description,
                  }}
                  badge={item.badge}
                  label={item.label}
                  size="medium"
                />
              </div>
            ))}
          </Carousel>
        </div>
      </Category>

      <Category
        title={<>Enterprise Apps</>}
        description="Keep your company data secure with centralized users management and assets storage"
        browse={
          <Link href="/marketplace/enterprise">
            <a className={s.headerViewAll}>
              <span>View all ({enterpriseApps.count})</span>
              <ArrowRight />
            </a>
          </Link>
        }
      >
        <div className={s.carouselWrapper}>
          <Carousel options={carouselOptions}>
            {page.enterpriseApps.map((item, index) => (
              <div key={index} className={s.emblaSlide}>
                <MarketplaceCard
                  href={`/marketplace/enterprise/${item.slug}`}
                  technology={item.logo}
                  text={{
                    title: item.title,
                    description: item.description,
                  }}
                  badge={item.badge}
                  label={item.label}
                  size="medium"
                />
              </div>
            ))}
          </Carousel>
        </div>
      </Category>
    </Layout>
  );
}
