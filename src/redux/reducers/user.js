import { userConstants } from '../constants';

const initialState = {
  user: null,
};

function user(state = initialState, action) {
  switch (action.type) {
    case userConstants.USER_UPDATE:
      return {
        user: action.user,
      };
    case userConstants.USER_CLEAR:
      return {};
    default:
      return state;
  }
}

export default user;
