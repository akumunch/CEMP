const API_BASE_URL = "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const body = await response.json();
      message = body.detail || message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getClubs() {
  return request("/api/clubs/");
}

export function getEvents() {
  return request("/api/events/");
}

export function getEventById(id) {
  return request(`/api/events/${id}`);
}

export function getRegistrations() {
  return request("/api/registrations/");
}

export function createClub(data) {
  return request("/api/clubs/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function createEvent(data) {
  return request("/api/events/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function registerForEvent(data) {
  return request("/api/registrations/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteRegistration(id) {
  return request(`/api/registrations/${id}`, {
    method: "DELETE",
  });
}
