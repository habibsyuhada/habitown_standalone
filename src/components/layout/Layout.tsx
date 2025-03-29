import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>Copyright © {new Date().getFullYear()} - HabiTown - All rights reserved</p>
        </div>
      </footer>
    </div>
  );
} 