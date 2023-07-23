import Head from 'next/head';
import Sidebar from '@/components/Widgets/Sidebar';

export default function Lobby() {

  return (
    <>
      <Head>
        <title>Darshboard</title>
        <meta
          name="description"
          content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
        />
      </Head>
      <main>
        <Sidebar />
      </main>
    </>
  );
}
