import store from '../helpers/store';
import { authenticationConstants, userConstants } from '../constants';
import asyncStorageMethods from '../helpers/async-storage';
import config from '../helpers/config';

function login(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  };

  store.dispatch({ type: authenticationConstants.LOGIN_REQUEST });
  return fetch(`${config.SERVER_URL}/api-token-auth/`, requestOptions)
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
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('email', email);
  const requestOptions = {
    method: 'POST',
    body: formData,
  };

  return fetch(`${config.SERVER_URL}/user/`, requestOptions)
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
  store.dispatch({ type: userConstants.USER_CLEAR });
}

const authenticationActions = {
  login,
  register,
  logout,
};

export default authenticationActions;
