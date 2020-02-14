import Layout from 'components/Layout';
import UseCaseHero from 'components/UseCaseHero';

export default function UseCase() {
  return (
    <Layout startNavbarHidden>
      <UseCaseHero
        title="Matter Supply for Nike"
        subtitle="Learn how Matter Supply delivered an award-winning Nike campaign in 4 weeks"
        image="/images/nike-epic-react2.jpg"
        gradient={['#24288b', '#d00591']}
      />
    </Layout>
  );
}
