import { useEffect, useState } from 'react';
import axios from 'axios';

export function useTicketsPolling(interval = 10000) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTickets = async () => {
      try {
        const response = await axios.get('/tickets/fetch');
        if (isMounted) {
          setTickets(response.data.tickets);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchTickets(); // initial fetch
    const timer = setInterval(fetchTickets, interval);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [interval]);

  return { tickets, loading, error };
}
