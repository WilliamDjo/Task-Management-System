export const isNone = (value) => value === null || value === undefined;

// Fetches with the route, method, body (optional). alerts and setAlerts are required if an error message is to
// be displayed. Token is not reqired but routes that need a token will give an error.
export const fetchBackend = async (route, method, body) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  // Only adds a body to the options if it is provided.
  if (!isNone(body)) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`http://127.0.0.1:5000${route}`, options);

  const data = await response.json();

  return data;
}
