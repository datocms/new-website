import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import { ParallaxProvider } from 'react-scroll-parallax';
import './style.css';

export default function Layout({ children }) {
  return (
    <>
      <ParallaxProvider>
        <Navbar />
        {children}
        <Footer />
      </ParallaxProvider>
    </>
  );
}
