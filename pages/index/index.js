import Layout from "components/Layout";
import Wrapper from "components/Wrapper";
import Hero from "components/Hero";
import Highlight from "components/Highlight";
import Button from "components/Button";
import Checks from "components/Checks";
import UseCases from "components/UseCases";
import Numbers, { Block as NumbersBlock } from "components/Numbers";
import PersonasPicker from "components/PersonasPicker";
import InterstitialTitle from "components/InterstitialTitle";
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
            The&nbsp;best&nbsp;companies are&nbsp;built&nbsp;on <Highlight>unified&nbsp;content</Highlight>
          </>
        }
        subtitle="More than 4.000 businesses use DatoCMS to create their online content at scale from a central hub, and distribute it easily via API to websites and any other digital experience."
      >
        <Checks
          checks={['No credit card', 'Easy setup']}
        >
          <Button fs="big">Try it now for free!</Button>
        </Checks>
      </Hero>

      <LogosBar />

      <InterstitialTitle subtitle="Here’s 3 symptoms to watch out">
        Are you losing money because of <Highlight>legacy content&nbsp;infrastructure</Highlight>?
      </InterstitialTitle>

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