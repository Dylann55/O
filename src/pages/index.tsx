import Head from 'next/head';

import { CallToAction } from '@/components/CallToAction';
import { Faqs } from '@/components/Faqs';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Pricing } from '@/components/Pricing';

export default function Home() {
  return (
    <>
      <Head>
        <title>Overonce</title>
        <meta
          name="description"
          content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
        />
      </Head>
      <Header />
      <main>
        <Hero />
        <CallToAction />
        <Pricing />
        <Faqs />
      </main>
    </>
  );
}
