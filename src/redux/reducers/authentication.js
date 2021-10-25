import { authenticationConstants } from '../constants';

function authentication(state = {}, action) {
  switch (action.type) {
    case authenticationConstants.LOGIN_REQUEST:
      return {
        isLoggingIn: true,
      };
    case authenticationConstants.LOGIN_SUCCESS:
      return {
        isLoggedIn: true,
        token: action.token,
      };
    case authenticationConstants.LOGIN_FAILURE:
      return {};
    case authenticationConstants.LOGOUT:
      return {};
    default:
      return state;
  }
}

export default authentication;
