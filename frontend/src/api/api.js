const API_URL = "http://localhost:3000/api"; // ajusta si es necesario

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error en la API");
  }

  if (res.headers.get("content-type")?.includes("application/json")) {
    return res.json();
  }

  return res;
}
