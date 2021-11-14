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

function getLikes(id, limit, offset) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader().Authorization },
  };

  return fetch(`${config.SERVER_URL}/user/${id}/likes/?limit=${limit}&offset=${offset}`, requestOptions)
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
  const formData = new FormData();
  if (payload.username) formData.append('username', payload.username);
  if (payload.password) formData.append('password', payload.password);
  if (payload.email) formData.append('email', payload.email);
  if (payload.first_name) formData.append('first_name', payload.first_name);
  if (payload.last_name) formData.append('last_name', payload.last_name);
  if (payload.bio) formData.append('bio', payload.bio);
  if (payload.profile_picture) formData.append('profile_picture', payload.profile_picture);
  const requestOptions = {
    method: 'PATCH',
    headers: { Authorization: authHeader().Authorization },
    body: formData,
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
  getLikes,
  getFollowers,
  getFollowing,
  updateUser,
};

export default userActions;
