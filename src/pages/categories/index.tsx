import Head from 'next/head';
import CategoryList from '../../components/categories/CategoryList';

export default function Categories() {
  return (
    <>
      <Head>
        <title>Kelola Kategori - HabiTown</title>
        <meta name="description" content="Kelola kategori untuk habit tracker Anda" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <CategoryList />
    </>
  );
} 