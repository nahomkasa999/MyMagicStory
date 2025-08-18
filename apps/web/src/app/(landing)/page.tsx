import React from 'react';
import { BooksSection } from '@/app/(landing)/_components/books-section';
import { ExampleSection } from '@/app/(landing)/_components/example-section';
import { FaqSection } from '@/app/(landing)/_components/faq-section';
import  FeatureSection from '@/app/(landing)/_components/feature-section';
import { HeroSection } from '@/app/(landing)/_components/hero-section';
import { ReviewSection } from '@/app/(landing)/_components/review-section';
import { ValueAndFooterSection } from '@/app/(landing)/_components/value-and-footer-section';

export default function Page() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <ExampleSection />
      <BooksSection />
      <ReviewSection />
      <FaqSection />
      <ValueAndFooterSection />
    </>
  );
}

