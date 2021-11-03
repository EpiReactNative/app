import store from '../helpers/store';
import authHeader from '../helpers/auth-header';
import { userConstants } from '../constants';
import config from '../helpers/config';

function whoami() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader().Authorization },
  };

  store.dispatch({ type: userConstants.USER_CLEAR });
  return fetch(`${config.SERVER_URL}/api/whoami/`, requestOptions)
    .then(async (response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response);
    })
    .then((data) => {
      store.dispatch({ type: userConstants.USER_UPDATE, user: data });
      console.log('before return');
      return data;
    })
    .catch((error = undefined) => {
      throw new Error(error);
    });
}

function getUser(id) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader().Authorization },
  };

  return fetch(`${config.SERVER_URL}/user/${id}/`, requestOptions)
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

function getPosts(id, limit, offset) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader().Authorization },
  };

  return fetch(`${config.SERVER_URL}/user/${id}/posts/?limit=${limit}&offset=${offset}`, requestOptions)
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

function getFollowers(id, limit, offset) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader().Authorization },
  };

  return fetch(`${config.SERVER_URL}/user/${id}/followers/?limit=${limit}&offset=${offset}`, requestOptions)
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

function getFollowing(id, limit, offset) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader().Authorization },
  };

  return fetch(`${config.SERVER_URL}/user/${id}/following/?limit=${limit}&offset=${offset}`, requestOptions)
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

function updateUser(id, payload) {
  console.log(payload);
  const requestOptions = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader().Authorization },
    body: JSON.stringify(payload),
  };

  return fetch(`${config.SERVER_URL}/user/${id}/`, requestOptions)
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

const userActions = {
  whoami,
  getUser,
  getPosts,
  getFollowers,
  getFollowing,
  updateUser,
};

export default userActions;
