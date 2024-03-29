// const REACT_APP_BASE_URL = 'http://localhost:3000';
const REACT_APP_BASE_URL = 'https://api.bofeof.nomoredomains.rocks'

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
