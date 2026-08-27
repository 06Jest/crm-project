const API_URL = import.meta.env.VITE_BACKEND_URL;

let refreshPromise: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(
      `${API_URL}/api/auth/refresh`,
      {
        method: "PATCH",
        credentials: "include",
      }
    )
      .then((response) => response.ok)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiClient(
  endpoint: string,
  options: RequestInit = {}
) {
  const request = () =>
    fetch(`${API_URL}${endpoint}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

  let response = await request();

  if (
    response.status === 401 &&
    endpoint !== "/api/auth/refresh" &&
    endpoint !== "/api/auth/oauth"
  ) {
    const refreshed = await refreshSession();

    if (!refreshed) {
      const data = await response.json().catch(() => null);

      throw new Error(
        data?.error ??
        data?.message ??
        "Session expired"
      );
    }

    response = await request();
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