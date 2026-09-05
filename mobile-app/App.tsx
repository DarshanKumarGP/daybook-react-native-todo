/**
 * Daybook — React Native To-Do App with authentication.
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store/store';
import { useAppDispatch } from './src/hooks/redux';
import { bootstrapAuth } from './src/store/slices/authSlice';
import { RootNavigator } from './src/navigation/RootNavigator';

const Bootstrapper: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  return <RootNavigator />;
};

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <Bootstrapper />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
