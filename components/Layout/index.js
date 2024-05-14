import Navbar from 'components/Navbar';
import MobileNavbar from 'components/MobileNavbar';
import Footer from 'components/Footer';
import BaseLayout from 'components/BaseLayout';

export default function Layout({ noCta, children, preview }) {
  return (
    <BaseLayout preview={preview}>
      <Navbar />
      <MobileNavbar />

      {children}
      <Footer noCta={noCta} />
    </BaseLayout>
  );
}
