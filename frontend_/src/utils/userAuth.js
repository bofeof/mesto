
import { REACT_APP_BASE_URL } from './constants'

function getResponse(res) {
  if (res.ok) {
    return res.json();
  } else {
    res.json().then((errText) => console.log('Дополнительное сообщение для пользователя:', errText || '-'));
    return Promise.reject(`Ошибка: ${res.status}, ${res.statusText}`);
  }
}

export function register(userData) {
  return fetch(`${REACT_APP_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
    .then((res) => getResponse(res))
    .then((res) => res)
    .catch((err) => console.log(err));
}

export function login(userData) {
  return fetch(`${REACT_APP_BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
    .then((res) => getResponse(res))
    .then((res) => res)
    .catch((err) => console.log(err));
}

export function checkToken(token) {
  return fetch(`${REACT_APP_BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${localStorage.getItem('mestoToken')}`,
    },
  })
    .then((res) => getResponse(res))
    .then((res) => res)
    .catch((err) => console.log(err));
}
