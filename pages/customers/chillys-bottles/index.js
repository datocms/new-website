import Layout from 'components/Layout';
import UseCaseHero from 'components/UseCaseHero';

export default function UseCase() {
  return (
    <Layout startNavbarHidden>
      <UseCaseHero
        title="Chilly's Bottles"
        subtitle="Learn how Arduino doubled his time-to-market speed with DatoCMS"
        image="https://scontent.cdninstagram.com/v/t51.2885-15/sh0.08/e35/p640x640/84330341_1203202163220785_650060509806797665_n.jpg?_nc_ht=scontent.cdninstagram.com&_nc_ohc=jZlpb4xXAn8AX8ISaL8&oh=fe7b2e74585743fe03d9cdb68e50d46c&oe=5ED40417"
        gradient={['#152424', '#213b40']}
      />
    </Layout>
  );
}
