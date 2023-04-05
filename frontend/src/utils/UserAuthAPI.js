export default class UserAuthAPI {
  constructor(CONFIG_API) {
    this._configAPI = CONFIG_API;
  }

  async _getResponse(res) {
    if (res.ok) {
      return res.json();
    }
    const userMessage = await res.json().then((errText) => errText.message || '');
    return Promise.reject(new Error(`Ошибка: ${res.status}. ${userMessage}`));
  }

  register(userData) {
    return fetch(`${this._configAPI.mestoUrl}/signup`, {
      method: 'POST',
      headers: this._configAPI.headers,
      body: JSON.stringify(userData),
    }).then((res) => this._getResponse(res));
  }

  login(userData) {
    return fetch(`${this._configAPI.mestoUrl}/signin`, {
      method: 'POST',
      headers: this._configAPI.headers,
      body: JSON.stringify(userData),
      credentials: this._configAPI.credentials,
    }).then((res) => this._getResponse(res));
  }

  logout() {
    return fetch(`${this._configAPI.mestoUrl}/signout`, {
      method: 'POST',
      headers: this._configAPI.headers,
      credentials: this._configAPI.credentials,
    }).then((res) => this._getResponse(res));
  }

  checkCurrentUser() {
    return fetch(`${this._configAPI.mestoUrl}/users/me`, {
      method: 'GET',
      headers: this._configAPI.headers,
      credentials: this._configAPI.credentials,
    }).then((res) => this._getResponse(res));
  }
}
