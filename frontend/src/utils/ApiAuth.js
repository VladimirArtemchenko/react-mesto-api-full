class ApiAuth {
    constructor({ baseUrl }) {
        this._baseUrl = baseUrl
    }

    _checkStatus(res) {
        if (res.ok) {
            return res.json()
        } else {
            return Promise.reject(`Ошибка: ${res.status}`)
        }
    }

    register(dataAuth) {
        console.log(`${this._baseUrl}`);
        return fetch(`${this._baseUrl}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataAuth),
        }).then(this._checkStatus)
    }

    login(dataAuth) {
        return fetch(`${this._baseUrl}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataAuth),
        }).then(this._checkStatus)
    }

    checkToken(token) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }).then(this._checkStatus)
    }
}

export const apiAuth = new ApiAuth({
    baseUrl: 'https://api.artemchenko.nomoredomains.sbs',
})