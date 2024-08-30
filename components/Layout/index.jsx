import BaseLayout from 'components/BaseLayout';
import Footer from 'components/Footer';
import NewNavbar from 'components/NewNavbar';

export default function Layout({ finalCta = true, children, preview }) {
  return (
    <BaseLayout preview={preview}>
      <NewNavbar />
      {children}
      <Footer finalCta={finalCta} />
    </BaseLayout>
  );
}
