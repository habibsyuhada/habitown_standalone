import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSession } from '../store/authSlice';
import { RootState } from '../store';

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  isLoading: boolean;
}>({
  isAuthenticated: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getSession());
  }, [dispatch]);

  const value = {
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext); 