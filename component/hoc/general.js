import React from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';

export default Comp => {
  return ({ isLoading, children }) => (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
        <Comp style={styles.container}>
          {children}
        </Comp>


      </TouchableWithoutFeedback>
      {isLoading && (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.transpance,
          ]}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centering: {
    alignItems: 'center', justifyContent: 'center', padding: 8,
  },
  gray: {
    backgroundColor: '#cccccc',
  },
  transpance: { backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center' }
});