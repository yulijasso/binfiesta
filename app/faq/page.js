"use client"; // Enable client-side rendering for this page

import React from 'react';
import FAQ from '../../components/Faq'; // Assuming Faq.js is in the components folder

const FaqPage = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <FAQ />
    </div>
  );
};

export default FaqPage;
