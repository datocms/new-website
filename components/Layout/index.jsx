import BaseLayout from 'components/BaseLayout';
import Footer from 'components/Footer';
import MobileNavbar from 'components/MobileNavbar';
import NewNavbar from 'components/Newnavbar';

export default function Layout({ noCta, children, preview }) {
  return (
    <BaseLayout preview={preview}>
      <NewNavbar />
      <MobileNavbar />

      {children}
      <Footer noCta={noCta} />
    </BaseLayout>
  );
}
