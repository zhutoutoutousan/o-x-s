module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // react-native-worklets/plugin is automatically added by babel-preset-expo v54
    // when react-native-worklets is installed
  };
};
