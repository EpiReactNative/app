import { combineReducers } from 'redux';
import authentication from './authentication';
import user from './user';

const Reducers = combineReducers({
  authentication,
  user,
});

export default Reducers;
