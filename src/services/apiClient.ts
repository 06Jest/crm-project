  // src/api/apiClient.ts

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
          method: "PATCH",
          credentials: "include",
        }
      );

      if (refreshResponse.ok) {
        return  fetch(
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

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        typeof data?.error === "string"
          ? data.error
          : data?.error?.[0]?.message ??
            data?.message ??
            `API Error: ${response.status}`;

      throw new Error(message);
    }

    return data;
  }