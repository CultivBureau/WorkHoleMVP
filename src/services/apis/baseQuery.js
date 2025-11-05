import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken, setAuthToken, removeAuthToken, getRefreshToken, isTokenExpired, getUserInfo } from "../../utils/page";

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

  // If the result is 401, check if we have cookie data first (for custom roles)
  // This prevents redirecting to login when token is valid but /me API fails
  if (result.error && result.error.status === 401) {
    const userInfoFromCookie = getUserInfo();
    
    // If we have cookie data (valid token decoded), don't redirect to login
    // ProtectedRoute will handle access based on cookies
    if (userInfoFromCookie) {
      // Reset refresh attempts and return error - let ProtectedRoute handle it
      refreshAttempts = 0;
      return result;
    }
    
    // Only try to refresh if we have a refresh token and no cookie data
    if (refreshAttempts < MAX_REFRESH_ATTEMPTS) {
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
    } else {
      // Too many refresh attempts, redirect to login
      refreshAttempts = 0;
      removeAuthToken();
      window.location.href = '/';
    }
  } else if (result.error && result.error.status !== 401) {
    // Reset refresh attempts for non-401 errors
    refreshAttempts = 0;
  }

  return result;
};
