import Layout from 'components/Layout';
import Head from 'next/head';
import { renderMetaTags } from 'react-datocms';
import gql from 'graphql-tag';
import { gqlStaticProps, seoMetaTagsFields } from 'lib/datocms';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import OtherPersonasPicker from 'components/OtherPersonasPicker';
import TitleIllustrationStripWithContent from 'components/TitleIllustrationStripWithContent';
import InterstitialTitle from 'components/InterstitialTitle';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import Bullets from 'components/Bullets';
import Quote from 'components/Quote';
import TitleStripWithContent from 'components/TitleStripWithContent';
import SuccessIcon from 'public/icons/regular/check-circle.svg';
import Arrow3 from 'public/images/illustrations/arrow-sketch-3.svg';
import Crown from 'public/images/illustrations/corona2.svg';
import Bugs from 'public/images/illustrations/bugs1.svg';
import Space from 'components/Space';

import s from './style.module.css';

export const getStaticProps = gqlStaticProps(
  gql`
    query {
      page: homePage {
        seo: _seoMetaTags {
          ...seoMetaTagsFields
        }
      }
    }
    ${seoMetaTagsFields}
  `,
);

function ContentCreators({ page, preview }) {
  return (
    <Layout preview={preview}>
      <Head>
        {renderMetaTags(page.seo)}
        <title>DatoCMS for Content Creators - Team</title>
      </Head>
      <Hero
        kicker="DatoCMS for Content Creators"
        title={
          <>
            Are you working in the{' '}
            <Highlight>most efficient&nbsp;way</Highlight>?
          </>
        }
        subtitle={
          <>
            No more copy-pasting between systems. DatoCMS helps you aggregate
            all of your content in one place and go live in a matter of seconds,
            on every channel.
          </>
        }
      />

      <TitleStripWithContent
        title={<>How DatoCMS helps you win the customer experience challenge</>}
      >
        <div className={s.ba}>
          <div className={s.baCol}>
            <Bugs />
            <div className={s.baColTitle}>Current state</div>
            <div className={s.baPoint}>
              <p>
                Content and images are produced for a{' '}
                <strong>single use</strong>, often in a single language
              </p>
            </div>
            <div className={s.baPoint}>
              <p>
                You publish content on traditional websites or mobile apps,{' '}
                <strong>independently</strong>
              </p>
            </div>
            <div className={s.baPoint}>
              <p>
                Once published, single projects <strong>become stale</strong>,
                hurting brand perception
              </p>
            </div>
          </div>
          <div className={s.baInterstitial}>
            <div className={s.baPoint}>
              <Arrow3 />
            </div>
            <div className={s.baPoint}>
              <Arrow3 />
            </div>
            <div className={s.baPoint}>
              <Arrow3 />
            </div>
          </div>
          <div className={s.baCol}>
            <Crown />
            <div className={s.baColTitle}>With DatoCMS</div>

            <div className={s.baPoint}>
              <p>
                Content is a building block: stored in libraries, localized,{' '}
                <strong>available for use everywhere</strong>
              </p>
            </div>
            <div className={s.baPoint}>
              <p>
                <strong>Publish anywhere:</strong> websites, mobile, digital
                display, wearables, conversational interfaces, etc.
              </p>
            </div>
            <div className={s.baPoint}>
              <p>
                Content is <strong>continuously delivered</strong>, updated and
                improved, kept in-sync between products
              </p>
            </div>
          </div>
        </div>
      </TitleStripWithContent>

      <Quote
        quote={
          <>
            With DatoCMS we made the impossibile: we launched a successful
            omnichannel campaign in <Highlight>less than a month</Highlight>.
          </>
        }
        author="Tizio Caio, Chief Marketing Officer @BigshotFirm"
      />

      <Space top={4} bottom={3}>
        <InterstitialTitle>
          Everything you&nbsp;need, <Highlight>no&nbsp;compromises</Highlight>
        </InterstitialTitle>
      </Space>

      <Flag
        style="good"
        title={
          <>
            <FlagHighlight>Work collaboratively</FlagHighlight> without risks
          </>
        }
        image="faces"
      >
        <p>
          Produce publication workflows, see updates in real-time from your team
          members, lock items on which you are working to prevent collisions,
          always see who is working on what.
        </p>

        <Bullets
          style="good"
          icon={SuccessIcon}
          bullets={[
            'Custom roles',
            'Real-time updates',
            'Lock items to prevent collisions',
          ]}
        />
      </Flag>

      <Flag
        style="good"
        title={
          <>
            <FlagHighlight>Flexible&nbsp;layouts</FlagHighlight>,
            no&nbsp;IT&nbsp;needed
          </>
        }
        image="oniric-world"
      >
        <p>
          Compose inspiring visual stories by alternating a number of reusable
          custom components independently, without needing development or IT
          resources.
        </p>

        <Bullets
          style="good"
          icon={SuccessIcon}
          bullets={[
            'Build your own repeatable blocks',
            'Reorganize on the fly with drag&drop',
          ]}
        />
      </Flag>

      <Quote
        quote={
          <>
            We tried DatoCMS, and the team loved it; it felt good, it felt very
            nice, and{' '}
            <Highlight>our team at Nike has been super happy with it</Highlight>
            .
          </>
        }
        author="Marc Ammann, CEO @ Matter Supply Co."
      />

      <Flag
        style="good"
        image="robot-ai"
        title={
          <>
            <FlagHighlight>AI-assisted</FlagHighlight> asset management
          </>
        }
      >
        <p>
          Organize all your digital assets in folders, locate media files
          quickly using AI-powered tagging and advanced search capabilities,
          publish them wherever you want with perfect quality and speed.
        </p>

        <Bullets
          style="good"
          icon={SuccessIcon}
          bullets={[
            'Search by color, EXIF information',
            'SEO management built-in',
          ]}
        />
      </Flag>

      <Flag
        style="good"
        title={
          <>
            Best in-class <FlagHighlight>localization support</FlagHighlight>
          </>
        }
        image="flags-sandwich"
      >
        <p>
          Deliver relevant, consistent content on every locale, on every device.
          All your content can be localizable, including rich text, images,
          geopoints and especially your URLs.
        </p>

        <Bullets
          style="good"
          icon={SuccessIcon}
          bullets={[
            'Up to 60 locales per project',
            'Integrable with external localization platforms',
          ]}
        />
      </Flag>

      <TitleIllustrationStripWithContent
        image="zen-garden"
        title="A fast, distraction-free writing experience"
        subtitle={
          <>
            Everything in DatoCMS is focused on helping you create great
            content. Forget cluttered interfaces,{' '}
            <strong>everything is right where you need it</strong>. And you can
            always change the defaults and personalize the experience if you
            want.
          </>
        }
      >
        <div className={s.boxPros}>
          <div className={s.boxProsInner}>
            <Bullets
              style="good"
              icon={SuccessIcon}
              bullets={[
                'Preview changes in real-time',
                'Full revision history',
                'Scheduled publishing',
              ]}
            />
          </div>
        </div>
      </TitleIllustrationStripWithContent>

      <OtherPersonasPicker
        title="Not just for content creators"
        currentPersonas="content-creators"
      />
    </Layout>
  );
}

export default ContentCreators;
