// const REACT_APP_BASE_URL = 'http://localhost:3000';
const REACT_APP_BASE_URL = 'https://api.bofeof.nomoredomains.rocks';
const configAPI = {
  mestoUrl: REACT_APP_BASE_URL,
  headers: {
    authorization: "",
    "Content-Type": "application/json",
  },
};

export { configAPI, REACT_APP_BASE_URL };
