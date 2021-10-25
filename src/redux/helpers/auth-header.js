import store from './store';

function authHeader() {
  const state = store.getState();
  const { token } = state.authentication;

  if (token) {
    return { Authorization: `Token ${token}` };
  }
  return {};
}

export default authHeader;
