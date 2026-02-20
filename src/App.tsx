import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import LocalVideo from './components/LocalVideo';

export const App = () => {
  return (
    <ImageBackground
      source={require('./assets/background.png')}
      style={styles.background}>
      <View style={styles.container}>
        <LocalVideo />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    color: 'white',
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
