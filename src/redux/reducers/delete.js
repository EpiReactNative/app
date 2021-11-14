import { deleteConstants } from '../constants';

function deletePost(state = {}, action) {
  switch (action.type) {
    case deleteConstants.DELETE_REQUEST:
      return {
        isDelete: true,
      };
    case deleteConstants.DELETE_SUCCESS:
      return {
        isDelete: true,
      };
    case deleteConstants.DELETE_FAILURE:
      return {};
    default:
      return state;
  }
}

export default deletePost;
