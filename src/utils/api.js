const baseUrl = "http://localhost:3001";

export const checkResponse = (res) =>
  res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);

export const request = (url, options) =>
  fetch(url, options).then(checkResponse);

export function getItems() {
  return request(`${baseUrl}/items?_sort=_id&_order=desc`);
}

export function addItem({ name, imageUrl, weather }) {
  return request(`${baseUrl}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, imageUrl, weather }),
  });
}

export function deleteItem(id) {
  return request(`${baseUrl}/items/${id}`, { method: "DELETE" });
}
