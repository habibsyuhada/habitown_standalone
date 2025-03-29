import Head from 'next/head';
import { useAuth } from '../lib/AuthContext';
import HabitList from '../components/habits/HabitList';

export default function Home() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <Head>
        <title>HabiTown - Track Your Habits</title>
        <meta name="description" content="Track your habits and build consistent routines" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to HabiTown</h1>
          <p className="text-lg">
            {isAuthenticated 
              ? 'Track your habits across devices and build better routines!'
              : 'Start tracking your habits locally or sign in to sync across devices!'}
          </p>
        </div>
        
        <HabitList />
      </div>
    </>
  );
}
