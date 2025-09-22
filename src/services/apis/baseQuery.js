import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken, setAuthToken, removeAuthToken, getRefreshToken, isTokenExpired } from "../../utils/page";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Track refresh attempts to prevent infinite loops
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 2;

// Custom base query with automatic token refresh for all APIs
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  })(args, api, extraOptions);

  // If the result is 401 and we have a refresh token, try to refresh
  if (result.error && result.error.status === 401 && refreshAttempts < MAX_REFRESH_ATTEMPTS) {
    const refreshToken = getRefreshToken();
    
    if (refreshToken && !isTokenExpired(refreshToken)) {
      try {
        refreshAttempts++;
        
        const refreshResult = await fetchBaseQuery({
          baseUrl: `${baseUrl}/auth`,
        })({
          url: '/refresh',
          method: 'POST',
          body: { refresh_token: refreshToken },
        }, api, extraOptions);

        if (refreshResult.data && refreshResult.data.access_token) {
          // Store the new access token
          setAuthToken(refreshResult.data.access_token);
          
          // Reset refresh attempts on successful refresh
          refreshAttempts = 0;
          
          // Retry the original request with the new token
          result = await fetchBaseQuery({
            baseUrl,
            prepareHeaders: (headers) => {
              headers.set("Authorization", `Bearer ${refreshResult.data.access_token}`);
              return headers;
            },
          })(args, api, extraOptions);
        } else {
          // Refresh failed, remove tokens and redirect to login
          refreshAttempts = 0;
          removeAuthToken();
          window.location.href = '/';
        }
      } catch (error) {
        // Refresh failed, remove tokens and redirect to login
        refreshAttempts = 0;
        removeAuthToken();
        window.location.href = '/';
      }
    } else {
      // No valid refresh token, remove tokens and redirect to login
      refreshAttempts = 0;
      removeAuthToken();
      window.location.href = '/';
    }
  } else if (result.error && result.error.status === 401) {
    // Too many refresh attempts, redirect to login
    refreshAttempts = 0;
    removeAuthToken();
    window.location.href = '/';
  } else if (result.error && result.error.status !== 401) {
    // Reset refresh attempts for non-401 errors
    refreshAttempts = 0;
  }

  return result;
};
