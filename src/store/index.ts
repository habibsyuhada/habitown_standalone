import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import habitsReducer from './habitsSlice';
import themeReducer from './themeSlice';
import { AuthState, HabitState, ThemeState } from '../types/models';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['auth'], // We don't want to persist auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
  habits: habitsReducer,
  theme: themeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Declare RootState type that includes PersistPartial
export interface RootState {
  auth: AuthState;
  habits: HabitState;
  theme: ThemeState;
}

export type AppDispatch = typeof store.dispatch; 