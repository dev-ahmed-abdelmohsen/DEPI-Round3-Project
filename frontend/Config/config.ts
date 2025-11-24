const domain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || `http://api.${domain}`;
export const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_BASE_URL || `http://n8n.${domain}`;
export const API_BASE_URL_INTERNAL = process.env.API_BASE_URL_INTERNAL || API_BASE_URL; // Use internal if set, otherwise fallback to external

