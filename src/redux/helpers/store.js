import { createStore, applyMiddleware } from 'redux';
// import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import Reducers from '../reducers';

const store = createStore(Reducers, applyMiddleware(thunk));

export default store;
