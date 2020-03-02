import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import BaseLayout from 'components/BaseLayout';

export default function Layout({ noCta, children }) {
  return (
    <BaseLayout>
      <Navbar />
      {children}
      <Footer noCta={noCta} />
    </BaseLayout>
  );
}
