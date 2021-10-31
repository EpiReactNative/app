import { userConstants } from '../constants';

const initialState = {
  selfuser: null,
};

function user(state = initialState, action) {
  switch (action.type) {
    case userConstants.USER_UPDATE:
      return {
        selfuser: action.user,
      };
    case userConstants.USER_CLEAR:
      return {};
    default:
      return state;
  }
}

export default user;
