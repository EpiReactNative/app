import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Reducers from './src/redux/reducers';
import Navigation from './src/Navigation';

const store = createStore(Reducers, applyMiddleware(thunk));

function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

export default App;
