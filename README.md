# HabiTown - Habit Tracker App

HabiTown adalah aplikasi habit tracker yang dapat digunakan secara lokal tanpa login, atau dengan login untuk menyimpan data ke Supabase dan dapat disinkronkan antar perangkat.

## Fitur

- Buat dan kelola kebiasaan (habits) dengan beberapa kategori
- Lacak kemajuan harian, mingguan, atau bulanan
- Lihat statistik dan streak kemajuan Anda
- Dapat digunakan secara lokal tanpa perlu login
- Sinkronisasi data antar perangkat dengan login Supabase

## Teknologi yang Digunakan

- Next.js
- TypeScript
- Redux & Redux Toolkit untuk state management
- Redux Persist untuk penyimpanan lokal
- Supabase untuk autentikasi dan database
- DaisyUI (Tailwind CSS) untuk UI
- date-fns untuk manipulasi tanggal

## Cara Penggunaan

1. Clone repository ini
2. Install dependensi dengan `npm install`
3. Salin `.env.local.example` ke `.env.local` dan isi dengan kredensial Supabase Anda
4. Jalankan aplikasi dengan `npm run dev`
5. Buka `http://localhost:3000` di browser Anda

## Struktur Database Supabase

```sql
-- Tabel Categories  
CREATE TABLE categories (  
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
    name VARCHAR(100) UNIQUE NOT NULL,  
    created_at TIMESTAMP DEFAULT NOW()  
);  

-- Tabel Habits  
CREATE TABLE habits (  
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,  
    name VARCHAR(100) NOT NULL,  
    description TEXT,  
    frequency VARCHAR(20) NOT NULL,  
    created_at TIMESTAMP DEFAULT NOW()  
);  

-- Tabel Habit_Records  
CREATE TABLE habit_records (  
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,  
    date DATE NOT NULL,  
    completed BOOLEAN DEFAULT FALSE,  
    created_at TIMESTAMP DEFAULT NOW()  
);
```

## Lisensi

MIT
