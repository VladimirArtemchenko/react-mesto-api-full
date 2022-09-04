class Api {
  constructor(data) {
    this._url = data.url;
  }

  _checkStatus(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getInitialCards(token) {
    return fetch(`${this._url}/cards`, {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET'
    })
      .then(this._checkStatus)
  }

  postNewCard(card,token) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: card.name,
        link: card.link
      })
    })
      .then(this._checkStatus)
  }

  getUserInfo(token) {
    return fetch(`${this._url}/users/me`, {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET'
    })
      .then(this._checkStatus)
  }

  editUserInfo(profile,token) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: profile.name,
        about: profile.about
      })
    })
      .then(this._checkStatus)
  }

  editUserAvatar(avatar,token) {
    console.log(avatar)
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(avatar)
    })
      .then(this._checkStatus)
  }

  changeLikeCardStatus(cardId, isLiked, token) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: `${isLiked ? 'DELETE' : 'PUT'}`,
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(this._checkStatus)
  }

  deleteCard(cardId,token) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(this._checkStatus)
  }
}

export const api = new Api({
  url: 'https://api.artemchenko.nomoredomains.sbs',
})
