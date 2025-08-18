"use client"
import React from 'react';
import { BooksSection } from '@/app/(landing)/_components/books-section';
import { ExampleSection } from '@/app/(landing)/_components/example-section';
import { FaqSection } from '@/app/(landing)/_components/faq-section';
import  FeatureSection from '@/app/(landing)/_components/feature-section';
import { HeroSection } from '@/app/(landing)/_components/hero-section';
import { ReviewSection } from '@/app/(landing)/_components/review-section';
import { ValueAndFooterSection } from '@/app/(landing)/_components/value-and-footer-section';
import { supabase } from "@/lib/supabase/supabaseClient";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard"); // already logged in
      }
    });
  }, [router]);
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

