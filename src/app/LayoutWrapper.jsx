'use client';

import { usePathname } from 'next/navigation';
import Header from '../components/Pages/Header';
import Footer from '../components/Pages/Footer';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.includes('/dashboards');

  return (
    <>
      {!isDashboard && <Header />}
      <main className="flex-grow">{children}</main>
      {!isDashboard && <Footer />}
    </>
  );
}