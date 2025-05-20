import React from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import FeaturedListings from '../components/home/FeaturedListings';
import PopularCategories from '../components/home/PopularCategories';
import RecentListings from '../components/home/RecentListings';
import TrustBadges from '../components/home/TrustBadges';
import DownloadApp from '../components/home/DownloadApp';
import CTA from '../components/home/CTA';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedListings />
      <PopularCategories />
      <RecentListings />
      <TrustBadges />
      <DownloadApp />
      <CTA />
    </Layout>
  );
};

export default HomePage;