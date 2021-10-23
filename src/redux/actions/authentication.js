function login(dispatch, username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  };

  return fetch('http://127.0.0.1:8000/api-token-auth/', requestOptions)
    .then(async (response) => {
      if (response.ok) {
        return response.json();
      }
      return response.text().then((text) => { throw new Error(text); });
    })
    .then((data) => {
      dispatch({ type: 'USER_STATE_CHANGE', isLoggedIn: true, token: data.token });
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

  return fetch('http://127.0.0.1:8000/user/', requestOptions)
    .then(async (response) => {
      if (response.ok) {
        return response.json();
      }
      return response.text().then((text) => { throw new Error(text); });
    })
    .then((data) => data);
}

const authenticationActions = {
  login,
  register,
};

export default authenticationActions;
