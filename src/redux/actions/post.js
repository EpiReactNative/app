import store from '../helpers/store';
import { uploadConstants } from '../constants';
import authHeader from '../helpers/auth-header';

const SERVER_URL = 'http://localhost:8000';
// const SERVER_URL = 'https://epigrambe.herokuapp.com';

function uploadPost({ image, caption }) {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('caption', caption);
  const requestOptions = {
    method: 'POST',
    headers: { Authorization: authHeader().Authorization },
    body: formData,
  };

  store.dispatch({ type: uploadConstants.UPLOAD_REQUEST });
  return fetch(`${SERVER_URL}/post/`, requestOptions)
    .then(async (response) => {
      if (response.ok) {
        return response.json();
      }
      store.dispatch({ type: uploadConstants.UPLOAD_FAILURE });
      return response.text().then((text) => { throw new Error(text); });
    })
    .then((data) => {
      store.dispatch({ type: uploadConstants.UPLOAD_SUCCESS });
      return data;
    });
}

const postActions = {
  uploadPost,
};

export default postActions;
