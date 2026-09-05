module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$':
      '@react-native-async-storage/async-storage/jest/async-storage-mock',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '@react-native|' +
      'react-native|' +
      '@react-navigation|' +
      'react-redux|' +
      '@reduxjs/toolkit|' +
      'immer|' +
      'react-native-screens|' +
      'react-native-safe-area-context|' +
      '@react-native-async-storage/async-storage|' +
      '@react-native-community/datetimepicker' +
      ')/)',
  ],
};
