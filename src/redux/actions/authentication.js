import store from '../helpers/store';
import { authenticationConstants } from '../constants';
import asyncStorageMethods from '../helpers/async-storage';

const SERVER_URL = 'http://localhost:8000';
// const SERVER_URL = 'https://epigrambe.herokuapp.com';

function login(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  };

  store.dispatch({ type: authenticationConstants.LOGIN_REQUEST });
  return fetch(`${SERVER_URL}/api-token-auth/`, requestOptions)
    .then(async (response) => {
      if (response.ok) {
        return response.json();
      }
      store.dispatch({ type: authenticationConstants.LOGIN_FAILURE });
      return response.text().then((text) => { throw new Error(text); });
    })
    .then((data) => {
      asyncStorageMethods.setStorage('token', data.token);
      store.dispatch({ type: authenticationConstants.LOGIN_SUCCESS, token: data.token });
      return data;
    });
}

function register(username, email, password) {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('password', password);
  const requestOptions = {
    method: 'POST',
    body: formData,
  };

  return fetch(`${SERVER_URL}/user/`, requestOptions)
    .then(async (response) => {
      if (response.ok) {
        return response.json();
      }
      return response.text().then((text) => { throw new Error(text); });
    })
    .then((data) => data);
}

function logout() {
  asyncStorageMethods.removeStorage('token');
  store.dispatch({ type: authenticationConstants.LOGOUT });
}

const authenticationActions = {
  login,
  register,
  logout,
};

export default authenticationActions;
