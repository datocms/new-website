import Layout from 'components/Layout';
import UseCaseHero from 'components/UseCaseHero';

export default function UseCase() {
  return (
    <Layout startNavbarHidden>
      <UseCaseHero
        title="Arduino"
        subtitle="Learn how Arduino doubled his time-to-market speed with DatoCMS"
        image="/images/arduino.jpg"
        gradient={['#0A343A', '#3098B2']}
      />
    </Layout>
  );
}
