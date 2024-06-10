import { AuthContext } from '@/auth';
import { useContext, useDebugValue } from 'react';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { isAuthenticated } = context;

  useDebugValue(isAuthenticated, (isAuthenticated) =>
    isAuthenticated ? 'Logged In' : 'Logged Out'
  );

  return context;
};
