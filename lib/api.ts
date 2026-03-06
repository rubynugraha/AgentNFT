/**
 * Utility function for making HTTP requests with retry logic and exponential backoff.
 * This helps handle temporary server issues like 503 Service Unavailable errors.
 */

export async function fetchDataWithRetry(
  url: string,
  options: RequestInit = {},
  retries: number = 3,
  delay: number = 1000
): Promise<Response> {
  try {
    const response = await fetch(url, options);

    // If it's a 503 error and we have retries left, wait and retry
    if (response.status === 503 && retries > 0) {
      console.warn(`Service unavailable (503) for ${url}. Retrying in ${delay / 1000}s...`);
      await new Promise(res => setTimeout(res, delay));
      return fetchDataWithRetry(url, options, retries - 1, delay * 2); // Exponential backoff
    }

    // For other errors, throw to be handled by caller
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error(`Failed to fetch ${url} after multiple retries:`, error);
    throw error;
  }
}

/**
 * Wrapper for fetchDataWithRetry that returns JSON data
 */
export async function fetchJSONWithRetry<T = any>(
  url: string,
  options: RequestInit = {},
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  const response = await fetchDataWithRetry(url, options, retries, delay);
  return response.json();
}

/**
 * POST request with retry logic
 */
export async function postDataWithRetry<T = any>(
  url: string,
  data: any,
  options: RequestInit = {},
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  const defaultOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const response = await fetchDataWithRetry(url, mergedOptions, retries, delay);
  return response.json();
}