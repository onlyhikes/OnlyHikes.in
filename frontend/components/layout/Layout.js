import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, noFooter = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-charcoal-950 text-offwhite bg-grain selection:bg-acid selection:text-charcoal-950">
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  );
}
