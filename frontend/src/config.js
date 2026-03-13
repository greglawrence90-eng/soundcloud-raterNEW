// API URL configuration
// In Railway/production, always use relative path
const isProduction = window.location.hostname !== 'localhost';
export const API_URL = isProduction ? '/api' : 'http://localhost:3001/api';
