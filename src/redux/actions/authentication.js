import store from '../helpers/store';
import { authenticationConstants } from '../constants';
import asyncStorageMethods from '../helpers/async-storage';

// const SERVER_URL = 'http://localhost:8000';
const SERVER_URL = 'https://epigrambe.herokuapp.com';

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
      throw new Error(response);
    })
    .then((data) => {
      asyncStorageMethods.setStorage('token', data.token);
      store.dispatch({ type: authenticationConstants.LOGIN_SUCCESS, token: data.token });
      return data;
    })
    .catch((error = undefined) => {
      store.dispatch({ type: authenticationConstants.LOGIN_FAILURE });
      throw new Error(error);
    });
}

function register(username, email, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  };

  return fetch(`${SERVER_URL}/user/`, requestOptions)
    .then(async (response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response);
    })
    .then((data) => data)
    .catch((error = undefined) => {
      throw new Error(error);
    });
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
