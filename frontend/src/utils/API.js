export class API {
  constructor(configAPI) {
    this._configAPI = configAPI;
  }

  _getToken() {
    this._configAPI.headers.authorization = 'Bearer ' + localStorage.getItem('mestoToken');
  }

  /**  get response from all request */
  _getResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}, ${res.statusText}`);
  }

  /** USER */

  /** {name, about, avatar, _id} */
  getUserData() {
    this._getToken();
    return fetch(`${this._configAPI.mestoUrl}/users/me`, {
      method: "GET",
      headers: this._configAPI.headers,
    }).then((res) => this._getResponse(res));
  }

  /*  userData = {name: .., about: ...}
      response => get new user-info **/
  setUserData(userData) {
    this._getToken();
    return fetch(`${this._configAPI.mestoUrl}/users/me`, {
      method: "PATCH",
      headers: this._configAPI.headers,
      body: JSON.stringify({
        name: userData.name,
        about: userData.about,
      }),
    }).then((res) => this._getResponse(res));
  }

  changeUserAvatar(userData) {
    this._getToken();
    return fetch(`${this._configAPI.mestoUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._configAPI.headers,
      body: JSON.stringify({
        avatar: userData.avatar,
      }),
    }).then((res) => this._getResponse(res));
  }

  /** CARDS */

  /** get current cards data from server */
  getGalleryData() {
    this._getToken();
    return fetch(`${this._configAPI.mestoUrl}/cards`, {
      method: "GET",
      headers: this._configAPI.headers,
    }).then((res) => this._getResponse(res));
  }

  /**  response -> get data of created card */
  addPhotoCard(cardData) {
    this._getToken();
    return fetch(`${this._configAPI.mestoUrl}/cards/`, {
      method: "POST",
      headers: this._configAPI.headers,
      body: JSON.stringify({
        name: cardData.name,
        link: cardData.link,
      }),
    }).then((res) => this._getResponse(res));
  }

  removePhotoCard(photoCardId) {
    this._getToken();
    return fetch(`${this._configAPI.mestoUrl}/cards/${photoCardId}`, {
      method: "DELETE",
      headers: this._configAPI.headers,
    }).then((res) => this._getResponse(res));
  }

  changeLikeCardStatus(photoCardId, isLiked) {
    this._getToken();
    return isLiked
      ? this._removePhotoLike(photoCardId)
      : this._addPhotoLike(photoCardId);
  }

  _addPhotoLike(photoCardId) {
    this._getToken();
    return fetch(`${this._configAPI.mestoUrl}/cards/${photoCardId}/likes`, {
      method: "PUT",
      headers: this._configAPI.headers,
    }).then((res) => this._getResponse(res));
  }

  _removePhotoLike(photoCardId) {
    this._getToken();
    return fetch(`${this._configAPI.mestoUrl}/cards/${photoCardId}/likes`, {
      method: "DELETE",
      headers: this._configAPI.headers,
    }).then((res) => this._getResponse(res));
  }
}
