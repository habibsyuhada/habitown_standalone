import Head from 'next/head';
import HabitList from '../../components/habits/HabitList';

export default function Habits() {
  return (
    <>
      <Head>
        <title>My Habits - HabiTown</title>
        <meta name="description" content="Track and manage your habits" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <HabitList />
    </>
  );
} 