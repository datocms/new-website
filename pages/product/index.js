import Head from 'components/Head';
import Hero from 'components/Hero';
import { highlightStructuredText } from 'components/Highlight';
import IntegrationsBanner from 'components/IntegrationsBanner';
import LazyImage from 'components/LazyImage';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Layout from 'components/Layout';
import Bullets from 'components/Bullets';
import SuccessIcon from 'public/icons/regular/check.svg';
import LayerIcon from 'public/icons/regular/layer-group-solid.svg';
import Button from 'components/Button';
import {
  gqlStaticPropsWithSubscription,
  imageFields,
  partnerTestimonialFields,
  reviewFields,
} from 'lib/datocms';
import Link from 'next/link';
import { Image as DatoImage, StructuredText } from 'react-datocms';
import { useQuerySubscription } from 'utils/useQuerySubscription';
import s from './style.module.css';

export const getStaticProps = gqlStaticPropsWithSubscription(/* GraphQL */ `
  query {
    allReviews(first: 100) {
      ...reviewFields
      _updatedAt
    }
    allPartnerTestimonials(first: 100) {
      ...partnerTestimonialFields
      _updatedAt
    }
    integrations: allIntegrations(first: 100) {
      id
      logo {
        url
      }
      integrationType {
        slug
      }
      squareLogo {
        url
      }
    }
    productOverview {
      header {
        value
      }
      subheader {
        value
      }
      pillars {
        theme
        pillarCallout
        title {
          value
        }
        capability1 {
          value
        }
        capability2 {
          value
        }
        capability3 {
          value
        }
        image {
          responsiveImage {
            ...imageFields
          }
        }
      }
    }
  }

  ${reviewFields}
  ${partnerTestimonialFields}
  ${imageFields}
`);

export default function Wall({ preview, subscription }) {
  const {
    data: { productOverview, integrations },
  } = useQuerySubscription(subscription);

  return (
    <Layout preview={preview}>
      <Head>
        <title>Better, with DatoCMS</title>
      </Head>

      <div>
        <Hero
          title={highlightStructuredText(productOverview.header)}
          subtitle={<StructuredText data={productOverview.subheader} />}
        />
        <div className={s.buttonContainer}>
          <Button fs="big">Try it for free</Button>
          <Button fs="big" s="invert">
            Contact sales
          </Button>
        </div>
      </div>

      {productOverview.pillars.map((pillar, index) => {
        return (
          <Flag
            kicker={pillar.theme}
            title={
              <>
                {/* <LayerIcon /> */}
                {highlightStructuredText(pillar.title, {
                  highlightWith: ({ children }) => {
                    return (
                      <FlagHighlight style="bad">{children}</FlagHighlight>
                    );
                  },
                })}
              </>
            }
            image={DatoImage}
            imageProps={{
              data: pillar.image.responsiveImage,
              objectFit: 'cover',
              objectPosition: '50% 50%',
            }}
            rightImage={!(index % 2)}
            hideDot
          >
            <p> {pillar.pillarCallout}</p>

            <Bullets
              style="bad"
              icon={SuccessIcon}
              largeBullet
              bullets={[
                <StructuredText data={pillar.capability1} />,
                <StructuredText data={pillar.capability2} />,
                <StructuredText data={pillar.capability3} />,
              ]}
            />
          </Flag>
        );
      })}

      <IntegrationsBanner
        title={<>Extensible and integrable by&nbsp;design</>}
        bubbles={integrations
          .filter((i) =>
            ['ci', 'static-generator', 'language', 'cdn', 'framework'].includes(
              i.integrationType.slug,
            ),
          )
          .slice(0, 30)
          .map((integration) => (
            <LazyImage
              key={integration.id}
              src={
                integration.squareLogo
                  ? integration.squareLogo.url
                  : integration.logo.url
              }
            />
          ))}
      >
        Being a API-first <Link href="/">headless CMS</Link>,{' '}
        <strong>
          DatoCMS easily integrates with any third-party platform or service
        </strong>
        . DatoCMS is considered to be the best CMS for developers because it
        offers some of the best tools in the market: plugins, webhooks,
        templates and SDKs to get you started in no time. Check them out on our{' '}
        <a href="https://github.com/datocms/" target="_blank" rel="noreferrer">
          official Github page
        </a>
      </IntegrationsBanner>
    </Layout>
  );
}
