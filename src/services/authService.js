import { apiRequest, clearAuthToken, setAuthToken } from "./apiService.js";

export async function loginUser(credentials) {
  const response = await apiRequest("/api/auth/login", "POST", credentials);
  setAuthToken(response.token);
  return response;
}

export async function registerUser(payload) {
  const response = await apiRequest("/api/auth/signup", "POST", payload);
  setAuthToken(response.token);
  return response;
}

export async function logoutUser() {
  try {
    await apiRequest("/api/auth/logout", "POST");
  } catch (error) {
    // ignore logout errors
  }
  clearAuthToken();
}

export async function updateProfile(payload) {
  return apiRequest("/api/auth/profile", "PUT", payload);
}

export async function changePassword(payload) {
  return apiRequest("/api/auth/change-password", "PUT", payload);
}

export async function forgotPassword(payload) {
  return apiRequest("/api/auth/forgot-password", "POST", payload);
}

export async function resetPassword(token, payload) {
  return apiRequest(`/api/auth/reset-password/${token}`, "POST", payload);
}
