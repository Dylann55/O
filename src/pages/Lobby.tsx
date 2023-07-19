import Head from 'next/head';
import { Header } from '@/components/Header';
import { useEffect } from 'react';
import Router from 'next/router';

import { checkSession, checkSessionSocial } from '@/utils/LocalStorage';

export default function Lobby() {

  useEffect(() => {
    checkSessionSocial();

    if(!checkSession()){
      Router.push('/');
    }
  }, []);


  return (
    <>
      <Head>
        <title>Darshboard</title>
        <meta
          name="description"
          content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
        />
      </Head>
      <Header />
      <main>

      </main>
    </>
  );
}
