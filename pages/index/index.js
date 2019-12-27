import Layout from "../../components/Layout";
import Wrapper from "../../components/Wrapper";
import Hero from "../../components/Hero";
import Highlight from "../../components/Highlight";
import Button from "../../components/Button";
import Checks from "../../components/Checks";
import UseCases from "../../components/UseCases";

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
      <UseCases />
    </Layout>
  );
}
