import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import BaseLayout from 'components/BaseLayout';

export default function Layout({ startNavbarHidden, children }) {
  return (
    <BaseLayout>
      {!startNavbarHidden && <Navbar />}
      {children}
      <Footer />
    </BaseLayout>
  );
}
