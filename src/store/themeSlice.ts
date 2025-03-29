import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeState, ThemeType } from '../types/models';

const isBrowser = typeof window !== 'undefined';

// Mendapatkan tema default berdasarkan preferensi sistem
const getDefaultTheme = (): ThemeType => {
  if (!isBrowser) return 'system';
  
  // Cek jika ada tema tersimpan di localStorage
  const savedTheme = localStorage.getItem('theme') as ThemeType | null;
  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    return savedTheme;
  }
  
  // Default ke 'system'
  return 'system';
};

// Menerapkan tema ke dokumen
export const applyTheme = (theme: ThemeType) => {
  if (!isBrowser) return;
  
  const html = document.documentElement;
  
  // Hapus class tema sebelumnya
  html.classList.remove('light', 'dark');
  
  // Simpan ke localStorage untuk penggunaan berikutnya
  localStorage.setItem('theme', theme);
  
  // Jika tema 'system', gunakan preferensi sistem
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    html.classList.add(prefersDark ? 'dark' : 'light');
  } else {
    // Jika light atau dark, terapkan langsung
    html.setAttribute('data-theme', theme);
    html.classList.add(theme);
  }
};

const initialState: ThemeState = {
  theme: getDefaultTheme()
};

// Menerapkan tema awal
if (isBrowser) {
  applyTheme(initialState.theme);
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.theme = action.payload;
      applyTheme(action.payload);
    }
  }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer; 