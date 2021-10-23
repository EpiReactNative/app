const initialState = {
  isLoggedIn: false,
  token: null,
};

const user = (state = initialState, action) => ({
  ...state,
  isLoggedIn: action.isLoggedIn,
  token: action.token,
});

export default user;
