const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function apiClient(
  endpoint: string,
  options: RequestInit = {}
) {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }
  );

  if (response.status === 401) {

    const refreshResponse = await fetch(
      `${API_URL}/api/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (refreshResponse.ok) {
      return fetch(
        `${API_URL}${endpoint}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options,
        }
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      `API Error: ${response.status}`
    );
  }

  return response.json();
}