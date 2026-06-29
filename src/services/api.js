const API_BASE_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

/**
 * Centered fetch wrapper for querying Strapi REST endpoints.
 * Returns the inner data object or null on connection failure / HTTP error,
 * allowing UI callers to fall back gracefully to static mock data.
 */
export async function fetchFromStrapi(endpoint) {
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
    
    // Support both Strapi v5 flat format and basic object lists
    return json.data || json;
  } catch (err) {
    console.warn(`[Strapi CMS] Fetch error at ${endpoint}. Gracefully falling back to mock data:`, err.message);
    return null;
  }
}

/**
 * Submit form content to Strapi's contacts content-type.
 */
export async function submitContactForm(data) {
  const res = await fetch(`${API_BASE_URL}/api/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson?.error?.message || 'Failed to send message via CMS.');
  }
  return await res.json();
}
