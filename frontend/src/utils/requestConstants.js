const REACT_APP_BASE_URL = 'http://localhost:3003';
const CONFIG_API = {
  mestoUrl: REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Credentials': true,
  },
  credentials: 'include',
};

export { CONFIG_API, REACT_APP_BASE_URL };
