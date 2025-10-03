import { BASE_URL } from "./constants";

const check = (res) => (res.ok ? res.json() : Promise.reject(res));

export const getItems = () => fetch(`${BASE_URL}/items`).then(check);

export const addItem = (data, token) =>
  fetch(`${BASE_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  }).then(check);

export const deleteItem = (id, token) =>
  fetch(`${BASE_URL}/items/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }).then(check);

export const updateUser = (data, token) =>
  fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then(check);

export const addCardLike = (id, token) =>
  fetch(`${BASE_URL}/items/${id}/likes`, {
    method: "PUT",
    headers: { authorization: `Bearer ${token}` },
  }).then(check);

export const removeCardLike = (id, token) =>
  fetch(`${BASE_URL}/items/${id}/likes`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${token}` },
  }).then(check);
