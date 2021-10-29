import store from '../helpers/store';
import authHeader from '../helpers/auth-header';
import { userConstants } from '../constants';
import { SERVER_URL } from '.';

function whoami() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader().Authorization },
  };

  store.dispatch({ type: userConstants.USER_CLEAR });
  return fetch(`${SERVER_URL}/api/whoami/`, requestOptions)
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

const userActions = {
  whoami,
};

export default userActions;
