import Head from 'next/head';
import Router from 'next/router';
import { useEffect } from 'react';

import { Header } from '@/components/Header';
import { AuthStateSocial } from '@/utils/DBFuntion';
import { checkSession } from '@/utils/LocalStorage';

export default function Lobby() {
  // Inicializo un clase para las funciones de la base de datos
  const instanciaAuthStateSocial = new AuthStateSocial();

  useEffect(() => {
    instanciaAuthStateSocial.checkSessionSocial();

    if (!checkSession()) {
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
      <main></main>
    </>
  );
}
