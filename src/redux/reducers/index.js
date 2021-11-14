import { combineReducers } from 'redux';
import authentication from './authentication';
import user from './user';
import upload from './upload';
import deletePost from './delete';

const Reducers = combineReducers({
  authentication,
  user,
  upload,
  deletePost,
});

export default Reducers;
