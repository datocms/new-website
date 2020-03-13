import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import Button from 'components/Button';
import Legal from 'components/Legal';
import s from './style.module.css';
import cn from 'classnames';
import Head from 'next/head';

export default function BrandAssets() {
  return (
    <Layout>
      <Head>
        <title>Brand assets</title>
      </Head>
      <Hero
        kicker="Our Company"
        title={
          <>
            <Highlight>Brand assets</Highlight>
          </>
        }
      />
      <Legal>
        <div className={s.intro}>
          <p>
            Hi! If you need to familiarize yourself with our brand resources,
            you’re in the right place. We prepared a few guidelines for you, so
            take your time to browse them and get to know the DatoCMS brand.
          </p>
          <p>
            <strong>
              TLDR; Inside our Brand Kit (.ZIP file, 356 kB) you will find every
              lockup in three different colorways, both in PNG and SVG format:
            </strong>
          </p>

          <Button as="a" href="/images/brand-assets/brand-kit.zip">
            Download the Brand Kit
          </Button>
        </div>

        <h3 id="Logo">Our logo and main lockup</h3>

        <img src="/images/brand-assets/main-lockup.svg" />

        <div>
          <p>
            DatoCMS logo was born as a combination of the D icon and the
            wordmark. They both went through some restyling, and now they look
            as beautiful as ever.
          </p>
          <p>
            The D icon uses a gradient shade, - worry not, more details ahead -
            while the wordmark will always have the coral fill. In case of small
            copy or whenever the gradient wouldn’t be visible, we just make
            everything coral.
          </p>
        </div>
        <h3 id="Icon">Our icon</h3>
        <div className="BrandingPage__two-cols-block">
          <div className="BrandingPage__two-cols-block__text">
            <p>
              Our company name and the D icon really get along with each other
              and should always be used together. However, if the DatoCMS brand
              has already been established, it’s ok to use the icon on its own.{' '}
            </p>
            <p>
              On plain backgrounds, either very bright or dark, we either use
              the gradient or the coral version. On busy or colored backgrounds
              we want to be kind to our eyes, so we switch to a basic white
              version of our D.
            </p>
          </div>
          <div className="BrandingPage__two-cols-block__gallery">
            <img src="/images/brand-assets/main-icon.svg" />
          </div>
        </div>
        <div className={s.grid}>
          <div>
            <img src="/images/brand-assets/alt-icon1.svg" />
          </div>
          <div>
            <img src="/images/brand-assets/alt-icon2.svg" />
          </div>
        </div>
        <h3 id>Other useful lockups</h3>
        <div>
          <p>
            We created an alternative wordmark for both our horizontal and
            vertical mockup to go along the D icon. Why you say? Well, sometimes
            - in small copy - the word CMS is hardly readable; make it bigger,
            problem solved. This is the way to go in case the main logo would be
            smaller than 110px wide in digital, but please never make it smaller
            than 70px wide.
          </p>
        </div>

        <img src="/images/brand-assets/alternative-lockups.svg" />

        <div>
          <p>
            In the same fashion, these are the vertical lockups we designed.
            Note that the D icon gradient adapts to this new layout by changing
            its direction: from left to right to top to bottom. The main lockup
            is to be used at any time, although you may switch to the
            alternative wordmark when the logo would be smaller than 110px tall.
            Again, no need to squeeze it too much and make it smaller than 70px
            tall.
          </p>
        </div>

        <img src="/images/brand-assets/vertical-lockups.svg" />

        <h3 id="Typeface">There is life beyond Helvetica</h3>
        <div>
          <p>
            Colfax is our brand typeface. Quoting Process, an independent type
            foundry based in Minneapolis, Colfax is a ‘refined oval sans serif
            of 20th-century origins and 21st-century sensibilities’. This
            ‘nearly geometric’ typeface combines beautifully with Spectral, our
            serif typeface, and stands firmly on its own.{' '}
          </p>
          <p>
            Curious about the design process? Head over to this{' '}
            <a href="https://processtypefoundry.com/blog/2012/03/designing-colfax/">
              blog post
            </a>
            .
          </p>
        </div>

        <img src="/images/brand-assets/colfax.svg" />

        <h3 id="Colors">Coral is our main brand color</h3>

        <div className={s.color} style={{ background: '#FF7751' }}>
          <div className={s.colorCaption}>
            <strong>Coral</strong>
            <br />
            #FF7751
          </div>
        </div>

        <div>
          <p>
            Coral is the lively and dynamic color that makes DatoCMS
            recognizable. And no, the choice was made way before Pantone
            announced Living Coral color of the year 2019! While DatoCMS coral
            sits on a more orange hue, it still embraces the values of our
            young, playful and energetic company.
          </p>
        </div>
        <h3 id>We also use gradient sometimes</h3>

        <div
          className={s.color}
          style={{
            background: 'linear-gradient(to right, #FF593D, #FF7751)',
          }}
        >
          <div className={s.colorCaption}>
            <strong>Orangesoda</strong>
            <br />
            #FF593D
          </div>
          <div className={cn(s.colorCaption, s.colorCaptionRight)}>
            <strong>Coral</strong>
            <br />
            #FF7751
          </div>
        </div>

        <div>
          <p>
            Everybody loves gradients. Living in an ever-shifting environment,
            we need to adapt to changes and face new challenges every day
            quickly. A splash of energy makes our coral even cooler!{' '}
          </p>
        </div>
        <h3 id>When coral isn’t enough</h3>
        <div className={s.grid}>
          <div>
            <div className={s.color} style={{ background: '#533451' }}>
              <div className={s.colorCaption}>
                <strong>Plum purple</strong>
                <br />
                #533451
              </div>
            </div>
          </div>
          <div>
            <div className={s.color} style={{ background: '#0FA3B1' }}>
              <div className={s.colorCaption}>
                <strong>Peackok blue</strong>
                <br />
                #0FA3B1
              </div>
            </div>
          </div>
          <div>
            <div className={s.color} style={{ background: '#30343F' }}>
              <div className={s.colorCaption}>
                <strong>Outer space</strong>
                <br />
                #30343F
              </div>
            </div>
          </div>
        </div>
        <div>
          <p>
            Sometimes we really need to express ourselves, and one color is not
            enough. We use this secondary palette to be more flexible and
            effective through our communication or whenever we need more accent
            colors in our CMS interface.
          </p>
        </div>
        <h3 id="Dos-and-Donts">Please do</h3>
        <div>
          <ul>
            <li>
              Give enough white space to the logo in order to breathe. No hard
              rules here, but 50% of the height or width as padding would be
              optimal.
            </li>
            <li>
              Use the lockup you think fits best for whatever your purpose is.
            </li>
          </ul>
        </div>
        <h3 id>Please do not</h3>
        <div>
          <ul>
            <li>
              Alter shape or color of any of the elements. We worked hard to
              make them the way they are and we want our brand to be consistent
              and recognizable.
            </li>
            <li>
              Alter the logo paths or any other element, or create a different
              lockup than the ones provided
            </li>
          </ul>
        </div>
      </Legal>
    </Layout>
  );
}
