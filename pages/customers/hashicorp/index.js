import Layout from 'components/Layout';
import UseCaseHero from 'components/UseCaseHero';

export default function UseCase() {
  return (
    <Layout startNavbarHidden>
      <UseCaseHero
        title="HashiCorp"
        subtitle="Learn how HashiCorp built a reliable and secure editorial workflow"
        image="https://www.datocms-assets.com/2885/1569253200-swilson-hc19.png"
        gradient={['#030501', '#211552']}
      />
    </Layout>
  );
}
