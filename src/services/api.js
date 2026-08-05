const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337';

/**
 * Centered fetch wrapper for querying custom Express REST endpoints.
 * Returns the data array/object or null on connection failure,
 * allowing UI callers to fall back gracefully to local mock data.
 */
export async function fetchFromApi(endpoint) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    console.warn(`[Backend API] Server unreachable at ${endpoint}. Returning null.`);
    return null;
  }
}

/**
 * Submit form content to backend contact endpoint (dispatches Resend email & saves in DB).
 */
export async function submitContactForm(data) {
  const res = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson?.error || 'Failed to send message via API.');
  }
  return await res.json();
}
