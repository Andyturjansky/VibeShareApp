// frontend/babel.config.cjs
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      ['module-resolver', {
        root: ['./'],
        alias: {
          '@components': './ui/components',
          '@screens': './ui/screens',
          '@navigation': './navigation',
          '@networking': './networking',
          '@styles': './ui/styles',
          '@assets': './assets',
          '@hooks': './hooks',
          '@context': './context',
          '@redux': './redux',
          '@helper': './helper',
          '@config': './config',
          '@utils': './ui/utils',
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.svg', '.png'],
      }],
    ],
  };
};
