import Head from 'next/head';
import AuthPage from '../../components/auth/AuthPage';

export default function Auth() {
  return (
    <>
      <Head>
        <title>Login / Register - HabiTown</title>
        <meta name="description" content="Login or register to sync your habits across devices" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AuthPage />
    </>
  );
} 