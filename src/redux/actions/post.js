import store from '../helpers/store';
import { uploadConstants } from '../constants';
import authHeader from '../helpers/auth-header';

// const SERVER_URL = 'http://localhost:8000';
const SERVER_URL = 'https://epigrambe.herokuapp.com';

function uploadPost({ image, caption }) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader().Authorization },
    body: JSON.stringify({ image, caption }),
  };

  store.dispatch({ type: uploadConstants.UPLOAD_REQUEST });
  return fetch(`${SERVER_URL}/post/`, requestOptions)
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

function getPosts() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader().Authorization },
  };

  store.dispatch({ type: uploadConstants.UPLOAD_REQUEST });
  return fetch(`${SERVER_URL}/post/`, requestOptions)
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

const postActions = {
  uploadPost,
  getPosts,
};

export default postActions;
