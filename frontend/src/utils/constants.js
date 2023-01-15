
const REACT_APP_BASE_URL = process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : 'http://localhost:3000';
const configAPI = {
  mestoUrl: REACT_APP_BASE_URL,
  headers: {
    authorization: "",
    "Content-Type": "application/json",
  },
};

export { configAPI, REACT_APP_BASE_URL };
