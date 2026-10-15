import { API_URL } from '../config.js';
// IBM conversion lab, exercises 3–4: register/login return an auth-token.
export async function authenticateAccount(endpoint, values) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values), signal: controller.signal,
    });
    const result = await response.json();
    if (!response.ok) {
      const validationErrors = result.errors?.map(error => error.msg).filter(Boolean).join(' ');
      throw new Error(result.error || validationErrors || 'Please check your details and try again.');
    }
    if (!result.authtoken) throw new Error('The server did not return a session. Please try again.');
    const profileResponse = await fetch(`${API_URL}/api/auth/user`, {
      headers: { 'auth-token': result.authtoken }, signal: controller.signal,
    });
    if (!profileResponse.ok) throw new Error('Unable to load your profile. Please log in again.');
    return { ...await profileResponse.json(), token: result.authtoken };
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The request timed out. Please try again.');
    if (error instanceof TypeError) throw new Error('Unable to connect. Check your connection and try again.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
