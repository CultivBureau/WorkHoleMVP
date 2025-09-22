"use client";
import Cookies from "js-cookie";

// Set tokens in cookies
export const setAuthTokens = (accessToken, refreshToken) => {
  Cookies.set("access_token", accessToken, { expires: 2 }); // 2 days for access token
  Cookies.set("refresh_token", refreshToken, { expires: 20 }); // 20 days for refresh token
};

// Set only access token
export const setAuthToken = (token) => {
  Cookies.set("access_token", token, { expires: 2 }); // 2 days
};

// Retrieve access token from cookies
export const getAuthToken = () => {
  const token = Cookies.get("access_token");
  return token || null;
};

// Retrieve refresh token from cookies
export const getRefreshToken = () => {
  const token = Cookies.get("refresh_token");
  return token || null;
};

// Remove all tokens from cookies
export const removeAuthToken = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
};

// Check if tokens are expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Get token expiry time in milliseconds
export const getTokenExpiry = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    return null;
  }
};

// Check if token will expire soon (within specified minutes)
export const isTokenExpiringSoon = (token, minutes = 5) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const expiryTime = payload.exp;
    const timeUntilExpiry = expiryTime - currentTime;
    const minutesUntilExpiry = timeUntilExpiry / 60;
    
    return minutesUntilExpiry <= minutes;
  } catch (error) {
    return true;
  }
};