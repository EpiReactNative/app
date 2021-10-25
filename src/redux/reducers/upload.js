import { uploadConstants } from '../constants';

function authentication(state = {}, action) {
  switch (action.type) {
    case uploadConstants.UPLOAD_STORE:
      return {
        image: action.image,
        caption: action.caption,
      };
    case uploadConstants.UPLOAD_REQUEST:
      return {
        ...state,
        isUploading: true,
      };
    case uploadConstants.UPLOAD_SUCCESS:
      return {
        ...state,
        isUploaded: true,
      };
    case uploadConstants.UPLOAD_FAILURE:
      return {};
    case uploadConstants.UPLOAD_CLEAR:
      return {};
    default:
      return state;
  }
}

export default authentication;
