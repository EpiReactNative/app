import { combineReducers } from 'redux';
import authentication from './authentication';
import user from './user';
import upload from './upload';

const Reducers = combineReducers({
  authentication,
  user,
  upload,
});

export default Reducers;
