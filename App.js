import React from 'react';
import { Provider } from 'react-redux';
import { NativeBaseProvider } from 'native-base';
import store from './src/redux/helpers/store';
import StackNavigator from './src/StackNavigator';

function App() {
  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <StackNavigator />
      </Provider>
    </NativeBaseProvider>
  );
}

export default App;
