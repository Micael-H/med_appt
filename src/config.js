// Set VITE_API_URL to the server preview URL supplied by Skills Network.
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8181').replace(/\/$/, '');
