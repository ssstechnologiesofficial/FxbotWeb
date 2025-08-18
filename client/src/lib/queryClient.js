import { QueryClient } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(queryKey[0], {
          headers,
          credentials: 'include'
        });
        
        if (!res.ok) {
          const error = await res.text();
          throw new Error(`${res.status}: ${error || "An error occurred"}`);
        }
        return res.json();
      },
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;

// Helper function for API requests
export const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Request failed');
  }

  return response.json();
};