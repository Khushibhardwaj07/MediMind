// A small hook that loads data from the backend when a page opens.
// It gives back: data, error, loading, and reload() to fetch again.
import { useCallback, useEffect, useState } from 'react';
import { apiRequest, describeError } from '../api/client.js';

export default function useApiGet(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await apiRequest(path));
    } catch (err) {
      setError(describeError(err));
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, loading, reload: load };
}