import { useState, useCallback } from "react";

interface UseAIReturn<T> {
  result: T | null;
  loading: boolean;
  error: string;
  generate: (...args: object []) => Promise<void>;
  clear: () => void;
}

export function useAI<T = string> (
  apiFn: (...args: object []) => Promise<T>
): UseAIReturn<T> {
  const [result, setResult] = useState<T | null> (null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const generate = useCallback(async (...args: object []) => {
    setLoading(true);
    setError('')
    setResult(null);
    try {
      const data = await apiFn(...args);
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('AI request failed. Please try again.')
      }
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  const clear = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  return { result, loading, error, generate, clear}

}
  