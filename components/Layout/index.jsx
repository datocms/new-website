import BaseLayout from 'components/BaseLayout';
import Footer from 'components/Footer';
import MobileNavbar from 'components/MobileNavbar';
import Navbar from 'components/Navbar';

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
