const initialState = {
  user: null,
};

const user = (state = initialState, action) => ({
  ...state,
  user: action.user,
});

export default user;
