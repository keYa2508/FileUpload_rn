import { View, StatusBar } from 'react-native';
import React from 'react';
import { Styles } from './src/lib/styles';
import { colors } from './src/lib/colors';
import Home from './src/Screens';
import { AppProvider } from './src/context';

const App = () => {
  return (
    <View style={[Styles.flex]}>
      <StatusBar animated backgroundColor={colors.primary} />
      <AppProvider>
        <Home />
      </AppProvider>
    </View>
  );
};

export default App;
