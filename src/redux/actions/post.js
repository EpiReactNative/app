import store from '../helpers/store';
import { uploadConstants } from '../constants';
import authHeader from '../helpers/auth-header';
import config from '../helpers/config';

function uploadPost({ image, caption }) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader().Authorization },
    body: JSON.stringify({ image, caption }),
  };

  store.dispatch({ type: uploadConstants.UPLOAD_REQUEST });
  return fetch(`${config.SERVER_URL}/post/`, requestOptions)
    .then(async (response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response);
    })
    .then((data) => {
      store.dispatch({ type: uploadConstants.UPLOAD_SUCCESS });
      return data;
    })
    .catch((error = undefined) => {
      store.dispatch({ type: uploadConstants.UPLOAD_FAILURE });
      throw new Error(error);
    });
}

function getPosts(limit, offset) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader().Authorization },
  };

  store.dispatch({ type: uploadConstants.UPLOAD_REQUEST });
  return fetch(`${config.SERVER_URL}/post/?limit=${limit}&offset=${offset}`, requestOptions)
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

  store.dispatch({ type: uploadConstants.UPLOAD_REQUEST });
  return fetch(`${config.SERVER_URL}/post/${id}/likes/?limit=${limit}&offset=${offset}`, requestOptions)
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

function likePost({ id }) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader().Authorization },
  };

  return fetch(`${config.SERVER_URL}/post/${id}/like/`, requestOptions)
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

function deletePost({ id }) {
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader().Authorization },
  };

  return fetch(`${config.SERVER_URL}/post/${id}/`, requestOptions)
    .then(async (response) => {
      if (response.ok) {
        return;
      }
      throw new Error(response);
    })
    .then(() => {})
    .catch((error = undefined) => {
      throw new Error(error);
    });
}

const postActions = {
  uploadPost,
  getPosts,
  getLikes,
  likePost,
  deletePost,
};

export default postActions;
