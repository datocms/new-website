import BaseLayout from 'components/BaseLayout';
import Footer from 'components/Footer';
import NewNavbar from 'components/NewNavbar';

export default function Layout({ noCta, children, preview }) {
  return (
    <BaseLayout preview={preview}>
      <NewNavbar />
      {children}
      <Footer noCta={noCta} />
    </BaseLayout>
  );
}
