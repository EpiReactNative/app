const initialState = {
  currentUser: null,
};

export const user = (state = initialState, action) => ({
  ...state,
  currentUser: action.currentUser,
});

export const empty = () => null;
