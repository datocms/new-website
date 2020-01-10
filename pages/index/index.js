import Layout from "components/Layout";
import Wrapper from "components/Wrapper";
import Hero from "components/Hero";
import Highlight from "components/Highlight";
import Button from "components/Button";
import Checks from "components/Checks";
import UseCases from "components/UseCases";
import Highlights, { Block as HighlightsBlock } from "components/Highlights";
import Numbers, { Block as NumbersBlock } from "components/Numbers";
import PersonasPicker from "components/PersonasPicker";
import Quote from "components/Quote";
import LogosBar from "components/LogosBar";
import { withDato } from "lib/datocms";

import styles from "./style.css";

function Homepage() {
  return (
    <Layout>
      <Hero
        title={
          <>
            Improve customer experiences with a <Highlight>seamless, omni-channel</Highlight> content platform
          </>
        }
        subtitle="Manage all your online content from a single hub, easily integrable with any digital product."
      >
        <Checks
          checks={['No credit card', 'Easy setup']}
        >
          <Button fs="big">Try it now for free!</Button>
        </Checks>
      </Hero>

      <LogosBar />

      <Highlights title="Your company struggles to build an effective CX, but why?">
        <HighlightsBlock title="Your content is spread into endless different CMSs
">
          All your content is safely stored in one hub, ready to be delivered anywhere
        </HighlightsBlock>
        <HighlightsBlock title="Manage your content in one place">
          All your content is safely stored in one hub, ready to be delivered anywhere
        </HighlightsBlock>
        <HighlightsBlock title="Manage your content in one place">
          All your content is safely stored in one hub, ready to be delivered anywhere
        </HighlightsBlock>
      </Highlights>

      <Numbers title="Why you should use DatoCMS">
        <NumbersBlock title="-79%">
          Operational costs for Hashicorp
        </NumbersBlock>
        <NumbersBlock title="30.000">
          Monthly transactions for Chilli's Bottles
        </NumbersBlock>
        <NumbersBlock title="300%">
          Time-to-market for for Nike
        </NumbersBlock>
      </Numbers>

      <PersonasPicker />

      <UseCases />
    </Layout>
  );
}

export default withDato(Homepage);