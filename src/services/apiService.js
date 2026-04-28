let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

export function clearAuthToken() {
  authToken = null;
}

export function getAuthHeaders() {
  const headers = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  return headers;
}

export async function apiRequest(url, method = "GET", body = null) {
  url = `http://localhost:3000${url}`;
  const config = {
    method,
    headers: getAuthHeaders(),
  };

  if (body && ["POST", "PUT", "PATCH"].includes(method)) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  let payload = null;
  try {
    payload = await response.json();
  } catch (err) {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload?.error?.message || payload?.message || response.statusText || "API request failed";
    throw new Error(message);
  }

  return payload;
}
