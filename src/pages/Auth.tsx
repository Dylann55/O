import Loader from '@/components/UI/Loader';
import { AuthStateSocial } from '@/utils/DBFuntion';
import Head from 'next/head';
import { useEffect } from 'react';

export default function Auth() {

  // Inicializo un clase para las funciones de la base de datos
  const instanciaAuthStateSocial = new AuthStateSocial();

  useEffect(() => {
    instanciaAuthStateSocial.checkSessionSocial();
  }, []);

  return (
    <>
      <Head>
        <title>Auth</title>
        <meta
          name="description"
          content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
        />
      </Head>
      <main>
        <Loader />
      </main>
    </>
  );
}
