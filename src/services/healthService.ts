export interface SystemHealth {
  success: boolean;
  server: 'ok' | 'down';
  database: 'ok' | 'down';
  authentication: 'ok' | 'down';
  status: 'operational' | 'degraded' | 'offline';
  message: string;
  timestamp: string;
}

export const fetchSystemHealthAPI = async (): Promise<SystemHealth> => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/health`,
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (response.status === 503) {
    return data;
  }

  if (!response.ok) {
    throw new Error(data.message || "Server is unavailable");
  }

  return data;
};