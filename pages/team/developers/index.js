import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import OtherPersonasPicker from 'components/OtherPersonasPicker';
import { withDato } from 'lib/datocms';
import InterstitialTitle from 'components/InterstitialTitle';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';
import IntegrationsBanner from 'components/IntegrationsBanner';
import Quote from 'components/Quote';
import Ill4 from 'public/images/illustrations/dato-svg-2a-01.svg';

import styles from './style.css';

function Developers() {
  return (
    <Layout>
      <Hero
        over="DatoCMS for Developers"
        title={
          <>
            Do you realize that your tech stack is literally{' '}
            <Highlight>killing your business</Highlight>?
          </>
        }
        subtitle={
          <>
            That’s right. You’re stuck with legacy web technologies that make
            all your websites and apps painfully slow and impossibly hard to
            build, maintain and improve. This needs to stop, now.
          </>
        }
      />

      <div style={{ margin: '10vh 0 10vh' }}>
        <InterstitialTitle style="two">
          Does any of this sounds painfully&nbsp;familiar?
        </InterstitialTitle>
      </div>

      <Flag
        style="bad"
        title={
          <>
            Your website is <FlagHighlight>slow</FlagHighlight>
          </>
        }
        subtitle="Got the guts to run PageSpeed?"
        image={Ill4}
      >
        <p>
          Try to check the performance of your site, we’ll wait. Unoptimized
          images, heavy pages and a shameful overall score? Well, it’s not your
          fault. The web is much harder than it was, and you’re using legacy
          tools that force devs to solve performance issues on their own.
        </p>
      </Flag>

      <Flag
        style="bad"
        title={
          <>
            Your architecture <FlagHighlight>doesn't&nbsp;scale</FlagHighlight>
          </>
        }
        subtitle="Can it handle massive spikes and adapt costs in real-time?"
        image={Ill4}
      >
        <p>
          As long as you’re receiving the usual amount of web traffic, pretty
          much any solution can work. But is your stack capable of handling
          prime-time TV website traffic, or without becoming completely
          unusable? And if so, what’s the up-front cost you’re paying for that?
        </p>
      </Flag>

      <Flag
        style="bad"
        title={
          <>
            Your CMS <FlagHighlight>is&nbsp;not&nbsp;flexible</FlagHighlight>
          </>
        }
        subtitle="Are your editors free to change websites without asking help from devs?"
        image={Ill4}
      >
        <p>
          It should not be your job to constantly make tiny changes to
          copy/images as asked by marketing/content teams. Yet to delegate the
          job directly to them your CMS must be able to enforce strict
          validation rules to editors, and have a fast way to continuously adapt
          the backend to their needs. Is that the case?
        </p>
      </Flag>

      <Flag
        style="bad"
        title={
          <>
            You're <FlagHighlight>wasting&nbsp;time</FlagHighlight>
          </>
        }
        subtitle="Are your projects reusing code and good practices?"
        image={Ill4}
      >
        <p>
          Most enterprises have many teams working on very similar dev projects,
          yet successful approaches learnt from deploying one product need to be
          manually rebuilt in each new product. How efficient is that? Teams
          should have a fast, standardized way of working.
        </p>
      </Flag>

      <Quote
        quote={
          <>
            With DatoCMS we made the impossibile: we launched a successful
            omnichannel campaign in <Highlight>less than a month</Highlight>.
          </>
        }
        author="Tizio Caio, Chief Marketing Officer @BigshotFirm"
      />

      <div style={{ margin: '10vh 0 10vh' }}>
        <InterstitialTitle style="two">
          Stop using monolithic CMSs. You need an Headless&nbsp;CMS
        </InterstitialTitle>
      </div>

      <Flag
        style="good"
        title={
          <>
            The freedom to use{' '}
            <FlagHighlight>any modern web tool</FlagHighlight>
          </>
        }
        image={Ill4}
      >
        <p>
          React, Vue, Gatsby, Next.js: take advantage of the best frameworks
          around, without carrying around CMS technical debt. Your content is
          reusable via API across any digital product — websites, apps,
          chatbots, IoT — and technology.
        </p>
      </Flag>

      <Quote
        quote={
          <>
            DatoCMS does not force you to speak its language, instead gives you
            the peace of mind of{' '}
            <Highlight>
              being able to use the right solution for each project
            </Highlight>
            .
          </>
        }
        author="Matteo Manzo, Technical Project Manager @LeanPanda"
      />

      <Flag
        style="good"
        title={
          <>
            Content and presentation, <FlagHighlight>decoupled</FlagHighlight>
          </>
        }
        image={Ill4}
      >
        <p>
          By making your editorial team write content using a structured,
          presentation-free format with a strict set of validation rules, you’ll
          remove any content bottleneck when shipping new digital projects.
        </p>
      </Flag>

      <Flag
        style="good"
        title={
          <>
            All the <FlagHighlight>modelling flexibility</FlagHighlight> you
            need
          </>
        }
        image={Ill4}
      >
        <p>
          From business-critical product pages, to dynamic landing-pages, to
          tiny microcopy: we give you all the flexibility you need to model any
          kind of content. And, most importantly, to change it over time.
        </p>
      </Flag>

      <IntegrationsBanner title={<>Extensible and integrable by&nbsp;design</>}>
        Being a API-first headless CMS, DatoCMS easily integrates with any
        third-party platform or service. Build your digital products by
        composing the best tools in the market: we offer plugins, webhooks,
        templates and SDKs to get you started in no time.
      </IntegrationsBanner>

      <Flag
        style="good"
        title={
          <>
            Build product, <FlagHighlight>not infrastructure</FlagHighlight>
          </>
        }
        image={Ill4}
      >
        <p>
          You’re not the one that should worry about traffic spikes, performance
          or maintenance: our managed global CDN will always ensure your content
          is accessible, secure, and close to every visitor.
        </p>
      </Flag>

      <OtherPersonasPicker
        title="Not just for developers"
        currentPersonas="developers"
      />
    </Layout>
  );
}

export default withDato(Developers);
