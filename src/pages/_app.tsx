import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import { AuthProvider } from '../lib/AuthContext';
import Layout from '../components/layout/Layout';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import MissedHabitsPrompt dengan dynamic import untuk menghindari SSR issues
const MissedHabitsPrompt = dynamic(
  () => import('../components/habits/MissedHabitsPrompt'),
  { ssr: false }
);

// Komponen untuk menangani preferensi tema di level aplikasi
function ThemeInitializer() {
  useEffect(() => {
    // Cek tema dari localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.add('light');
    } else {
      // Jika tidak ada tema yang disimpan atau tema 'system', gunakan preferensi sistem
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
    }
  }, []);
  
  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <ThemeInitializer />
          <Layout>
            <MissedHabitsPrompt />
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
