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

import styles from "./style.css";

export default function() {
  return (
    <Layout>
      <Hero
        title={
          <>
            Build digital experiences that <Highlight>inspire and convert</Highlight>
          </>
        }
        subtitle="Manage your content in a single hub and deliver beautifully crafted customer experiences on all your channels"
      >
        <Checks
          checks={['No credit card', 'Easy setup']}
        >
          <Button fs="big">Try it for free</Button>
        </Checks>
      </Hero>

      <Highlights title="Why you should use DatoCMS">
        <HighlightsBlock title="Manage your content in one place">
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

      <Quote
        quote={<>DatoCMS gives us <Highlight>flexibility</Highlight> and really good control over validation</>}
        author={<><strong>Jeff Escalante</strong>, Web designer Manager at Hashicorp</>}
      />

      <UseCases />
    </Layout>
  );
}
