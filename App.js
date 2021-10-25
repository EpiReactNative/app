import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/helpers/store';
import StackNavigator from './src/StackNavigator';

function App() {
  return (
    <Provider store={store}>
      <StackNavigator />
    </Provider>
  );
}

export default App;
