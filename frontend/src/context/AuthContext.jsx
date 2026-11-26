// The "name badge": shares the logged-in user with every page.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  apiRequest,
  clearSession,
  getStoredRefreshToken,
  refreshSession,
  setAuthFailureHandler,
  setSession,
} from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true while we check "was this person already logged in?" on page load
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If the session dies while using the app, show the login page.
    setAuthFailureHandler(() => setUser(null));

    let cancelled = false;

    async function restoreSession() {
      if (!getStoredRefreshToken()) {
        setLoading(false);
        return;
      }
      try {
        const data = await refreshSession();
        if (!cancelled) setUser(data.user);
      } catch {
        /* not logged in: the login page will show */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    });
    setSession(data);
    setUser(data.user);
  }, []);

  const signup = useCallback(async (fullName, email, password) => {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: { fullName, email, password },
      auth: false,
    });
    setSession(data);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getStoredRefreshToken();
    // Log out on screen right away, then tell the server in the background.
    clearSession();
    setUser(null);
    if (refreshToken) {
      try {
        await apiRequest('/auth/logout', { method: 'POST', body: { refreshToken }, auth: false });
      } catch {
        /* the token will expire by itself anyway */
      }
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, signup, logout }),
    [user, loading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// A shortcut hook: const { user } = useAuth();
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}