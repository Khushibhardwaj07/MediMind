// The ONLY file in the frontend that talks to the backend.
// It adds the login token, and refreshes it automatically when it expires.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const REFRESH_KEY = 'medimind_refresh_token';

// The access token lives only in memory (a normal variable).
// It disappears when the page is reloaded, and we get a new one using the refresh token.
let accessToken = null;

// If a refresh is already running, everyone waits for the same one.
// Our backend cancels ALL sessions if a refresh token is used twice,
// so two refreshes at the same time would log the user out.
let refreshPromise = null;

let onAuthFailure = () => {};

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details || null;
  }
}

// AuthContext uses this to find out when the session has died.
export const setAuthFailureHandler = (handler) => {
  onAuthFailure = handler;
};

export const getStoredRefreshToken = () => {
  try {
    return localStorage.getItem(REFRESH_KEY);
  } catch {
    return null; // storage can be blocked in some browsers
  }
};

export const setSession = ({ accessToken: newAccessToken, refreshToken }) => {
  accessToken = newAccessToken;
  try {
    localStorage.setItem(REFRESH_KEY, refreshToken);
  } catch {
    /* storage blocked: the user will simply have to log in again after a reload */
  }
};

export const clearSession = () => {
  accessToken = null;
  try {
    localStorage.removeItem(REFRESH_KEY);
  } catch {
    /* ignore */
  }
};

// Turns any error into a short message that is safe and kind to show on screen.
export const describeError = (err) => {
  if (err instanceof ApiError) {
    if (err.details && err.details.length > 0) {
      return err.details.map((item) => item.message).join('. ');
    }
    return err.message;
  }
  return 'Something went wrong. Please try again.';
};

// One plain request. No login logic in here.
async function rawFetch(path, { method = 'GET', body, token } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Please check your connection and try again.');
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      (data && data.error) || 'Something went wrong',
      data && data.details
    );
  }
  return data;
}

// Swaps the stored refresh token for a new pair of tokens.
export function refreshSession() {
  if (refreshPromise) return refreshPromise;

  const stored = getStoredRefreshToken();
  if (!stored) return Promise.reject(new ApiError(401, 'Not logged in'));

  refreshPromise = rawFetch('/auth/refresh', { method: 'POST', body: { refreshToken: stored } })
    .then((data) => {
      setSession(data);
      return data;
    })
    .catch((err) => {
      // Only forget the session if the server said "no". A network problem is not a "no".
      if (err.status === 401) clearSession();
      throw err;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

// The function every page uses.
// auth: true  -> sends the access token, and refreshes it if it expired.
// auth: false -> for login and signup, which need no token.
export async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
  if (!auth) return rawFetch(path, { method, body });

  // After a page reload we have no access token yet, so get one first.
  if (!accessToken && getStoredRefreshToken()) {
    try {
      await refreshSession();
    } catch {
      /* the request below will fail with 401 and be handled there */
    }
  }

  try {
    return await rawFetch(path, { method, body, token: accessToken });
  } catch (err) {
    if (err.status !== 401 || !getStoredRefreshToken()) throw err;

    // The access token probably expired (they last 15 minutes). Refresh and try once more.
    try {
      await refreshSession();
    } catch {
      onAuthFailure();
      throw err;
    }
    return rawFetch(path, { method, body, token: accessToken });
  }
}