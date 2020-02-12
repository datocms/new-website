import Layout from 'components/Layout';
import Hero from 'components/Hero';
import Highlight from 'components/Highlight';
import CreateModularBlocks from 'components/CreateModularBlocks';
import UseModularBlocks from 'components/UseModularBlocks';
import LandingPagesGenerator from 'components/LandingPagesGenerator';

import Quote from 'components/Quote';
import Flag, { Highlight as FlagHighlight } from 'components/Flag';

import s from './style.css';

function DynamicLayouts() {
  return (
    <Layout>
      <Hero
        over="Dynamic layouts"
        title={
          <>
            Build dynamic layouts with{' '}
            <Highlight>modular&nbsp;blocks</Highlight>
          </>
        }
        subtitle={
          <>
            Define reusable custom components and build dynamic layouts for
            landing pages, micro websites, case studies and testimonials
          </>
        }
      />

      <Flag
        style="good"
        title={
          <>
            Create <FlagHighlight>modular&nbsp;blocks</FlagHighlight>
          </>
        }
        image={CreateModularBlocks}
      >
        <p>
          Modular blocks allow you to define reusable custom components that
          enable your writers to build rich stories.
        </p>
      </Flag>

      <Flag
        style="good"
        title={
          <>
            <FlagHighlight>Organize and structure</FlagHighlight> your content
          </>
        }
        image={UseModularBlocks}
      >
        <p>
          Modular blocks are very flexible and easy to use. You can stack &amp;
          reorganize them on the fly with drag and drop functionality.
        </p>
      </Flag>

      <Quote
        quote={
          <>
            I think Modular Content is probably{' '}
            <Highlight>one of my favorite features</Highlight>. Being able to
            put together a piece of content that the client can see on one page
            and ‘hey, this gets very close to Squarespace‘.
          </>
        }
        author="Marc Ammann, CEO @ Matter Supply Co."
      />

      <Flag
        style="good"
        title={
          <>
            Easily build landing pages with{' '}
            <FlagHighlight>dynamic&nbsp;templates</FlagHighlight>
          </>
        }
        image={LandingPagesGenerator}
      >
        <p>
          Boost your acquisition and SEO by quickly creating rich and inspiring
          campaign pages featuring trends or events thanks to dynamic layouts.
        </p>
      </Flag>
    </Layout>
  );
}

export default DynamicLayouts;
