import Navbar from 'components/Navbar';
import './style.css';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
